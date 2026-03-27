terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.30.0"
    }
    external = {
      source  = "hashicorp/external"
      version = "2.3.0"
    }
  }
}

provider "aws" {
  shared_config_files = ["~/.aws/config"]

  shared_credentials_files = ["~/.aws/credentials"]

  profile = "james-dev-school"

  region = "us-west-2"
}

data "aws_iam_policy_document" "role" {
  //This is how IAM roles are created via Terraform

  statement {

    // `effect` can allow or prevent a resource from using a certain service
    effect = "Allow"

    // Defines what services this role will have access to
    principals {
      identifiers = ["lambda.amazonaws.com"]
      type        = "Service"
    }

    // AssumeRole grants temporary security clearance without creating a permanent policy
    actions = ["sts:AssumeRole"]
  }

}

resource "aws_iam_role" "backend_lambda_handler" {
  assume_role_policy = data.aws_iam_policy_document.role.json
}

# Package the Lambda function code
data "archive_file" "lambda_package" {
  type        = "zip"
  source_dir  = "${path.module}/dist/"
  output_path = "${path.module}/package/backend.zip"
}

resource "archive_file" "layer_package" {
  type        = "zip"
  source_dir  = "${path.module}/layer"
  output_path = "${path.module}/package/dependencies/layer.zip"
}

# Lambda Resources

resource "aws_lambda_layer_version" "dependencies" {
  depends_on       = [archive_file.layer_package]
  filename         = archive_file.layer_package.output_path
  layer_name       = "tweeter_server_layer"
  source_code_hash = archive_file.layer_package.output_base64sha256
}

resource "aws_lambda_function" "Lambdas" {
  for_each         = var.lambda
  depends_on       = [data.archive_file.lambda_package]
  function_name    = each.key
  role             = aws_iam_role.backend_lambda_handler.arn
  filename         = data.archive_file.lambda_package.output_path
  runtime          = "nodejs20.x"
  handler          = each.value.handler
  layers           = [aws_lambda_layer_version.dependencies.arn]
  source_code_hash = data.archive_file.lambda_package.output_base64sha256
}

# API Gateway resources

resource "aws_api_gateway_rest_api" "TweeterAPI" {
  name = "TweeterAPI"
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}


resource "aws_api_gateway_resource" "Resources" {
  for_each    = var.api_resource
  rest_api_id = aws_api_gateway_rest_api.TweeterAPI.id
  parent_id   = aws_api_gateway_rest_api.TweeterAPI.root_resource_id
  path_part   = each.value.pathPart
}

resource "aws_api_gateway_method" "Method" {
  for_each      = aws_api_gateway_resource.Resources
  rest_api_id   = aws_api_gateway_rest_api.TweeterAPI.id
  resource_id   = each.value.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "options" {
  for_each      = aws_api_gateway_resource.Resources
  rest_api_id   = aws_api_gateway_rest_api.TweeterAPI.id
  resource_id   = each.value.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "MethodIntegration" {
  depends_on              = [aws_lambda_function.Lambdas]
  for_each                = aws_api_gateway_resource.Resources
  rest_api_id             = aws_api_gateway_rest_api.TweeterAPI.id
  resource_id             = each.value.id
  http_method             = aws_api_gateway_method.Method[each.key].http_method
  type                    = "AWS"
  integration_http_method = "POST"
  content_handling        = "CONVERT_TO_TEXT"
  uri                     = aws_lambda_function.Lambdas[each.key].invoke_arn
}

resource "aws_api_gateway_integration" "options" {
  for_each    = aws_api_gateway_resource.Resources
  rest_api_id = aws_api_gateway_rest_api.TweeterAPI.id
  resource_id = each.value.id
  http_method = aws_api_gateway_method.options[each.key].http_method
  type        = "MOCK"
  request_templates = {
    "application/json" = "{ \"statusCode\": 200 }"
  }
}

resource "aws_api_gateway_method_response" "response_200" {
  for_each            = aws_api_gateway_resource.Resources
  rest_api_id         = aws_api_gateway_rest_api.TweeterAPI.id
  resource_id         = each.value.id
  http_method         = aws_api_gateway_method.Method[each.key].http_method
  status_code         = "200"
  response_models     = { "application/json" = "Empty" }
  response_parameters = local.cors_method_response_parameters
}

resource "aws_api_gateway_method_response" "options_200" {
  for_each            = aws_api_gateway_resource.Resources
  rest_api_id         = aws_api_gateway_rest_api.TweeterAPI.id
  resource_id         = each.value.id
  http_method         = aws_api_gateway_method.options[each.key].http_method
  status_code         = "200"
  response_models     = { "application/json" = "Empty" }
  response_parameters = local.cors_method_response_parameters
}

resource "aws_api_gateway_method_response" "response400" {
  for_each            = aws_api_gateway_resource.Resources
  rest_api_id         = aws_api_gateway_rest_api.TweeterAPI.id
  resource_id         = each.value.id
  http_method         = aws_api_gateway_method.Method[each.key].http_method
  status_code         = local.error_codes[0]
  response_models     = { "application/json" = "Empty" }
  response_parameters = local.cors_method_response_parameters
}

resource "aws_api_gateway_method_response" "response500" {
  for_each            = aws_api_gateway_resource.Resources
  rest_api_id         = aws_api_gateway_rest_api.TweeterAPI.id
  resource_id         = each.value.id
  http_method         = aws_api_gateway_method.Method[each.key].http_method
  status_code         = local.error_codes[1]
  response_models     = { "application/json" = "Empty" }
  response_parameters = local.cors_method_response_parameters
}

resource "aws_api_gateway_integration_response" "response_200Integration" {
  depends_on          = [aws_api_gateway_integration.MethodIntegration]
  for_each            = aws_api_gateway_resource.Resources
  rest_api_id         = aws_api_gateway_rest_api.TweeterAPI.id
  resource_id         = each.value.id
  http_method         = aws_api_gateway_method_response.response_200[each.key].http_method
  status_code         = aws_api_gateway_method_response.response_200[each.key].status_code
  response_parameters = local.cors_integration_response_parameters
}

resource "aws_api_gateway_integration_response" "options_integration" {
  depends_on          = [aws_api_gateway_integration.options]
  for_each            = aws_api_gateway_resource.Resources
  rest_api_id         = aws_api_gateway_rest_api.TweeterAPI.id
  resource_id         = each.value.id
  http_method         = aws_api_gateway_method.options[each.key].http_method
  status_code         = aws_api_gateway_method_response.options_200[each.key].status_code
  response_parameters = local.cors_integration_response_parameters
  response_templates = {
    "application/json" = ""
  }
}

resource "aws_api_gateway_integration_response" "error_response400" {
  depends_on          = [aws_api_gateway_integration.MethodIntegration]
  for_each            = aws_api_gateway_resource.Resources
  rest_api_id         = aws_api_gateway_rest_api.TweeterAPI.id
  resource_id         = each.value.id
  http_method         = aws_api_gateway_method_response.response400[each.key].http_method
  status_code         = aws_api_gateway_method_response.response400[each.key].status_code
  selection_pattern   = local.error_responses.400["selection_pattern"]
  response_parameters = local.cors_integration_response_parameters
}

resource "aws_api_gateway_integration_response" "error_response500" {
  depends_on          = [aws_api_gateway_integration.MethodIntegration]
  for_each            = aws_api_gateway_resource.Resources
  rest_api_id         = aws_api_gateway_rest_api.TweeterAPI.id
  resource_id         = each.value.id
  http_method         = aws_api_gateway_method_response.response500[each.key].http_method
  status_code         = aws_api_gateway_method_response.response500[each.key].status_code
  selection_pattern   = local.error_responses.500["selection_pattern"]
  response_parameters = local.cors_integration_response_parameters
}

resource "aws_api_gateway_deployment" "TweeterAPIDeployment" {
  rest_api_id = aws_api_gateway_rest_api.TweeterAPI.id
  depends_on = [
    aws_lambda_function.Lambdas,
    aws_api_gateway_integration.MethodIntegration,
    aws_api_gateway_integration_response.response_200Integration,
    aws_api_gateway_method_response.response_200,
    aws_api_gateway_method_response.response400,
    aws_api_gateway_method_response.response500,
    aws_api_gateway_integration_response.error_response400,
    aws_api_gateway_integration_response.error_response500,
    aws_api_gateway_method.options,
    aws_api_gateway_method_response.options_200,
    aws_api_gateway_integration.options,
    aws_api_gateway_integration_response.options_integration
  ]
}

resource "aws_lambda_permission" "runPermissions" {
  for_each      = aws_lambda_function.Lambdas
  action        = "lambda:InvokeFunction"
  function_name = each.value.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.TweeterAPI.execution_arn}/*"
}

# Documentation - look up existing doc part IDs
data "external" "doc_part_ids" {
  for_each = var.api_documentation
  program  = ["bash", "${path.module}/lookup_doc_part_id.sh"]
  query = {
    rest_api_id = aws_api_gateway_rest_api.TweeterAPI.id
    path        = var.api_resource[each.key].pathPart
    method      = "POST"
    type        = "METHOD"
  }
}

data "external" "doc_part_id_400" {
  for_each = var.api_documentation
  program  = ["bash", "${path.module}/lookup_doc_part_id.sh"]
  query = {
    rest_api_id = aws_api_gateway_rest_api.TweeterAPI.id
    path        = var.api_resource[each.key].pathPart
    method      = "POST"
    type        = "RESPONSE"
  }
}

data "external" "doc_part_id_500" {
  for_each = var.api_documentation
  program  = ["bash", "${path.module}/lookup_doc_part_id.sh"]
  query = {
    rest_api_id = aws_api_gateway_rest_api.TweeterAPI.id
    path        = var.api_resource[each.key].pathPart
    method      = "POST"
    type        = "RESPONSE"
  }
}

resource "aws_api_gateway_documentation_part" "method_docs" {
  for_each    = var.api_documentation
  rest_api_id = aws_api_gateway_rest_api.TweeterAPI.id
  lifecycle {
    create_before_destroy = true
  }
  location {
    type   = "METHOD"
    path   = "/${var.api_resource[each.key].pathPart}"
    method = "POST"
  }
  properties = jsonencode({
    description = each.value.description
  })
}

resource "aws_api_gateway_documentation_part" "response_400_docs" {
  for_each    = var.api_documentation
  rest_api_id = aws_api_gateway_rest_api.TweeterAPI.id
  lifecycle {
    create_before_destroy = true
  }
  location {
    type        = "RESPONSE"
    path        = "/${var.api_resource[each.key].pathPart}"
    method      = "POST"
    status_code = "400"
  }
  properties = jsonencode({
    description = each.value.response_400_desc
  })
}

resource "aws_api_gateway_documentation_part" "response_500_docs" {
  for_each    = var.api_documentation
  rest_api_id = aws_api_gateway_rest_api.TweeterAPI.id
  lifecycle {
    create_before_destroy = true
  }
  location {
    type        = "RESPONSE"
    path        = "/${var.api_resource[each.key].pathPart}"
    method      = "POST"
    status_code = "500"
  }
  properties = jsonencode({
    description = each.value.response_500_desc
  })
}

resource "aws_api_gateway_documentation_version" "TweeterAPIDocs" {
  rest_api_id = aws_api_gateway_rest_api.TweeterAPI.id
  version     = "v1"
  description = "API documentation"
  depends_on = [
    aws_api_gateway_documentation_part.method_docs,
    aws_api_gateway_documentation_part.response_400_docs,
    aws_api_gateway_documentation_part.response_500_docs
  ]
}

resource "aws_api_gateway_stage" "TweeterAPIStage" {
  deployment_id         = aws_api_gateway_deployment.TweeterAPIDeployment.id
  rest_api_id           = aws_api_gateway_rest_api.TweeterAPI.id
  stage_name            = "dev"
  documentation_version = aws_api_gateway_documentation_version.TweeterAPIDocs.version
}