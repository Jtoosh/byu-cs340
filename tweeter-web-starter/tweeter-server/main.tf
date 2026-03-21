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

locals {
  tweeter_api_id      = aws_api_gateway_rest_api.TweeterAPI.id
  getfollowees_id     = aws_api_gateway_resource.GetFollowees.id
  getfollowees_method = aws_api_gateway_method.loadMoreFollowees.http_method

  cors_method_response_parameters = {
    "method.response.header.Access-Control-Allow-Origin"  = true
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
  }

  cors_integration_response_parameters = {
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'"
  }

  error_responses = {
    "400" = {
      selection_pattern = ".*\\[400\\].*"
    }
    "500" = {
      selection_pattern = ".*\\[500\\].*"
    }
  }
}

# Look up existing API Gateway REST API by name for import purposes
data "aws_api_gateway_rest_api" "existing_api" {
  name = "TweeterAPI"
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

resource "aws_lambda_function" "GetFolloweesLambda" {
  depends_on       = [data.archive_file.lambda_package]
  function_name    = "GetFolloweesLambda"
  role             = aws_iam_role.backend_lambda_handler.arn
  filename         = data.archive_file.lambda_package.output_path
  runtime          = "nodejs20.x"
  handler          = "lambda/GetFolloweesLambda.handler"
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
  for_each = var.api_resource
  rest_api_id = aws_api_gateway_rest_api.TweeterAPI.id
  parent_id   = aws_api_gateway_rest_api.TweeterAPI.root_resource_id
  path_part   = "getfollowees"
}

module "api_gateway_endpoint_setup" {
  source = "./api_gateway_method_module"
  for_each = aws_api_gateway_resource.Resources
  rest_api_id = aws_api_gateway_rest_api.TweeterAPI.id
  resource_id = each.value.id
  http_method = "POST"
  authorization = "NONE"
  integration_type = "AWS"
  integration_http_method = "POST"
  integration_uri = aws_lambda_function.Lambdas[each.key].invoke_arn
  content_handling = "CONVERT_TO_TEXT"
  error_codes = local.error_codes
  error_selection_patterns = local.error_responses
}

module "api_gateway_CORS_setup" {
  source = "./api_gateway_method_module"
  for_each = aws_api_gateway_resource.Resources
  rest_api_id = aws_api_gateway_rest_api.TweeterAPI.id
  resource_id = each.value.id
  http_method = "OPTIONS"
  authorization = "NONE"
  integration_type = "MOCK"
  integration_http_method = "OPTIONS"
  integration_uri = ""
  cors_allow_origin = local.cors_allow_origin
  cors_allow_headers = local.cors_allow_headers
  cors_allow_methods = local.cors_allow_methods
}



resource "aws_api_gateway_deployment" "TweeterAPIDeployment" {
  rest_api_id = aws_api_gateway_rest_api.TweeterAPI.id
  depends_on = [module.api_gateway_endpoint_setup, module.api_gateway_CORS_setup]
}

# Documentation resources

# For importing existing documentation parts, we need to look up the ID by location
# If the documentation part doesn't exist yet, the import will fail during apply
# but that's expected since we're creating it via the resource block below
data "external" "loadMoreFolloweesDocPartId" {
  program = ["bash", "${path.module}/lookup_doc_part_id.sh"]
  query = {
    rest_api_id = data.aws_api_gateway_rest_api.existing_api.id
    path        = "/getfollowees"
    method      = "POST"
    type        = "METHOD"
  }
}

## Still buggy when there is conflicts between existence of docs between config and infrastructure. Comment this import out if manual documentation changes are made
import {
  to = aws_api_gateway_documentation_part.loadMoreFolloweesDoc
  id = "${data.aws_api_gateway_rest_api.existing_api.id}/${data.external.loadMoreFolloweesDocPartId.result.id}"
}

resource "aws_api_gateway_documentation_part" "loadMoreFolloweesDoc" {
  rest_api_id = aws_api_gateway_rest_api.TweeterAPI.id

  location {
    type   = "METHOD"
    path   = "/getfollowees"
    method = "POST"
  }

  properties = jsonencode({
    description = "Load more followees for the specified user"
  })
}

resource "aws_api_gateway_documentation_part" "loadMoreFollowees_400" {
  rest_api_id = aws_api_gateway_rest_api.TweeterAPI.id

  location {
    type        = "RESPONSE"
    path        = "/getfollowees"
    method      = "POST"
    status_code = "400"
  }

  properties = jsonencode({
    description = "Client error"
  })
}

resource "aws_api_gateway_documentation_part" "loadMoreFollowees_500" {
  rest_api_id = aws_api_gateway_rest_api.TweeterAPI.id

  location {
    type        = "RESPONSE"
    path        = "/getfollowees"
    method      = "POST"
    status_code = "500"
  }

  properties = jsonencode({
    description = "Server error"
  })
}

resource "aws_api_gateway_documentation_version" "TweeterAPIDocs" {
  rest_api_id = aws_api_gateway_rest_api.TweeterAPI.id
  version     = "v1"
  description = "Initial API docs"
  depends_on = [
    aws_api_gateway_documentation_part.loadMoreFolloweesDoc,
    aws_api_gateway_documentation_part.loadMoreFollowees_400,
    aws_api_gateway_documentation_part.loadMoreFollowees_500
  ]
}

resource "aws_api_gateway_stage" "TweeterAPIStage" {
  deployment_id         = aws_api_gateway_deployment.TweeterAPIDeployment.id
  rest_api_id           = aws_api_gateway_rest_api.TweeterAPI.id
  stage_name            = "dev"
  documentation_version = aws_api_gateway_documentation_version.TweeterAPIDocs.version
}

resource "aws_lambda_permission" "runPermissions" {
  for_each = aws_lambda_function.Lambdas
  action        = "lambda:InvokeFunction"
  function_name = each.value.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.TweeterAPI.execution_arn}/*"
}