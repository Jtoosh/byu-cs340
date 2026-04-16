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
  timeout          = 120
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
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
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
resource "aws_api_gateway_method_response" "options_method_response" {
  for_each    = aws_api_gateway_resource.Resources
  rest_api_id = aws_api_gateway_rest_api.TweeterAPI.id
  resource_id = each.value.id
  http_method = aws_api_gateway_method.options[each.key].http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin"  = true
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
  }
}

resource "aws_api_gateway_integration_response" "options_integration" {
  depends_on          = [aws_api_gateway_integration.options, aws_api_gateway_method_response.options_method_response]
  for_each            = aws_api_gateway_resource.Resources
  rest_api_id         = aws_api_gateway_rest_api.TweeterAPI.id
  resource_id         = each.value.id
  http_method         = aws_api_gateway_method.options[each.key].http_method
  status_code         = "200"
  response_parameters = local.cors_integration_response_parameters
  response_templates = {
    "application/json" = ""
  }
}

resource "aws_api_gateway_deployment" "TweeterAPIDeployment" {
  rest_api_id = aws_api_gateway_rest_api.TweeterAPI.id
  depends_on = [
    aws_lambda_function.Lambdas,
    aws_api_gateway_integration.MethodIntegration,
    aws_api_gateway_method.options,
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

# Documentation
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

resource "aws_api_gateway_documentation_version" "TweeterAPIDocs" {
  rest_api_id = aws_api_gateway_rest_api.TweeterAPI.id
  version     = "v1"
  description = "API documentation"
  depends_on = [
    aws_api_gateway_documentation_part.method_docs
  ]
}

resource "aws_api_gateway_stage" "TweeterAPIStage" {
  deployment_id = aws_api_gateway_deployment.TweeterAPIDeployment.id
  rest_api_id   = aws_api_gateway_rest_api.TweeterAPI.id
  stage_name    = "dev"
}

resource "aws_dynamodb_table" "status" {
  name           = "status"
  billing_mode   = "PROVISIONED"
  hash_key       = "user_alias"
  range_key      = "timestamp"
  read_capacity  = 100
  write_capacity = 100

  attribute {
    name = "user_alias"
    type = "S"
  }

  attribute {
    name = "timestamp"
    type = "N"
  }
}

resource "aws_dynamodb_table" "sessions" {
  name           = "sessions"
  billing_mode   = "PROVISIONED"
  hash_key       = "token"
  read_capacity  = 100
  write_capacity = 100

  attribute {
    name = "token"
    type = "S"
  }

  attribute {
    name = "user_alias"
    type = "S"
  }

  global_secondary_index {
    name            = "sessions_index"
    hash_key        = "user_alias"
    projection_type = "ALL"
    read_capacity   = 100
    write_capacity  = 100
  }
}

resource "aws_dynamodb_table" "feed" {
  name           = "feed"
  billing_mode   = "PROVISIONED"
  hash_key       = "owner_alias"
  range_key      = "timestamp"
  read_capacity  = 100
  write_capacity = 100

  attribute {
    name = "owner_alias"
    type = "S"
  }

  attribute {
    name = "timestamp"
    type = "N"
  }
}

resource "aws_dynamodb_table" "user" {
  name           = "user"
  billing_mode   = "PROVISIONED"
  hash_key       = "user_alias"
  read_capacity  = 100
  write_capacity = 100

  attribute {
    name = "user_alias"
    type = "S"
  }

}

resource "aws_dynamodb_table" "follows" {
  name           = "follows"
  billing_mode   = "PROVISIONED"
  hash_key       = "follower_handle"
  range_key      = "followee_handle"
  read_capacity  = 100
  write_capacity = 100

  attribute {
    name = "follower_handle"
    type = "S"
  }

  attribute {
    name = "followee_handle"
    type = "S"
  }

  global_secondary_index {
    name            = "follows_index"
    hash_key        = "followee_handle"
    projection_type = "ALL"
    read_capacity   = 100
    write_capacity  = 100
  }
}

data "aws_iam_policy_document" "dynamodb_access" {
  statement {
    effect = "Allow"
    actions = [
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
      "dynamodb:DeleteItem",
      "dynamodb:Query",
      "dynamodb:Scan",
      "dynamodb:BatchWriteItem"
    ]
    resources = [
      aws_dynamodb_table.status.arn,
      aws_dynamodb_table.sessions.arn,
      aws_dynamodb_table.feed.arn,
      aws_dynamodb_table.user.arn,
      aws_dynamodb_table.follows.arn,
      "arn:aws:dynamodb:us-west-2:615299777283:table/sessions/index/*",
      "arn:aws:dynamodb:us-west-2:615299777283:table/follows/index/*"
    ]
  }
}

resource "aws_iam_policy" "dynamodb_access" {
  name        = "lambda_dynamodb_access"
  description = "Allows Lambda functions to access DynamoDB tables"
  policy      = data.aws_iam_policy_document.dynamodb_access.json
}

resource "aws_iam_role_policy_attachment" "dynamodb_attachment" {
  role       = aws_iam_role.backend_lambda_handler.name
  policy_arn = aws_iam_policy.dynamodb_access.arn
}

data "aws_iam_policy_document" "backend_s3_access" {
  statement {
    effect  = "Allow"
    actions = ["s3:*"]
    resources = [
      "arn:aws:s3:::jt-340-user-images",
      "arn:aws:s3:::jt-340-user-images/*"
    ]
  }
}

resource "aws_iam_policy" "backend_s3_access" {
  name        = "backend_lambda_s3_access"
  description = "Allows Lambda functions to access S3 user images bucket"
  policy      = data.aws_iam_policy_document.backend_s3_access.json
}

resource "aws_iam_role_policy_attachment" "backend_s3_attachment" {
  role       = aws_iam_role.backend_lambda_handler.name
  policy_arn = aws_iam_policy.backend_s3_access.arn
}

data "aws_iam_policy_document" "sqs_access" {
  statement {
    effect  = "Allow"
    actions = ["sqs:*"]
    resources = [
      "arn:aws:sqs:us-west-2:615299777283:Post-Status-Queue",
      "arn:aws:sqs:us-west-2:615299777283:Update-Feed-Queue"
    ]
  }
}

resource "aws_iam_policy" "sqs_access" {
  name        = "lambda_sqs_access"
  description = "Allows Lambda functions to access SQS Queues"
  policy      = data.aws_iam_policy_document.sqs_access.json
}

resource "aws_iam_role_policy_attachment" "sqs_access_attachment" {
  role       = aws_iam_role.backend_lambda_handler.name
  policy_arn = aws_iam_policy.sqs_access.arn
}

data "aws_iam_policy" "cloudwatch_logs" {
  name = "AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "cloudwatch_logs_attachment" {
  role = aws_iam_role.backend_lambda_handler.name
  policy_arn = data.aws_iam_policy.cloudwatch_logs.arn
}
