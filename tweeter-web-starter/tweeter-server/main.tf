#########################
# TERRAFORM CONFIG      #
#########################

terraform {
  required_version = ">= 1.0.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

#########################
# PROVIDER              #
#########################

provider "aws" {
  profile = "james-dev-school"
  region  = "us-west-2"

  shared_config_files      = ["~/.aws/config"]
  shared_credentials_files = ["~/.aws/credentials"]
}

#########################
# LOCAL VALUES          #
#########################

locals {
  # API identifiers (will be set after resources are created)
  tweeter_api_id      = aws_api_gateway_rest_api.tweeter_api.id
  getfollowees_id     = aws_api_gateway_resource.get_followees.id
  getfollowees_method = aws_api_gateway_method.post_get_followees.http_method

  # CORS Configuration for API Gateway
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

  # Error Response Patterns
  error_responses = {
    "400" = {
      selection_pattern = ".*\\[400\\].*"
    }
    "500" = {
      selection_pattern = ".*\\[500\\].*"
    }
  }
}

#########################
# DATA SOURCES          #
#########################

# IAM Policy Document for Lambda Execution Role
data "aws_iam_policy_document" "lambda_assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

#########################
# IAM RESOURCES         #
#########################

# Lambda Execution Role
resource "aws_iam_role" "backend_lambda" {
  name               = "tweeter-backend-lambda-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

#########################
# LAMBDA RESOURCES      #
#########################

# Package Lambda function code
data "archive_file" "lambda_package" {
  type        = "zip"
  source_dir  = "${path.module}/dist/"
  output_path = "${path.module}/package/backend.zip"
}

# Package Lambda layer dependencies
data "archive_file" "layer_package" {
  type        = "zip"
  source_dir  = "${path.module}/layer"
  output_path = "${path.module}/package/dependencies/layer.zip"
}

# Lambda Layer for Dependencies
resource "aws_lambda_layer_version" "dependencies" {
  layer_name          = "tweeter-server-dependencies"
  description         = "Node.js dependencies for Tweeter backend"
  filename            = data.archive_file.layer_package.output_path
  source_code_hash    = data.archive_file.layer_package.output_base64sha256
  compatible_runtimes = ["nodejs20.x"]
}

# Main Lambda Function
resource "aws_lambda_function" "get_followees" {
  function_name    = "tweeter-get-followees"
  role             = aws_iam_role.backend_lambda.arn
  filename         = data.archive_file.lambda_package.output_path
  runtime          = "nodejs20.x"
  handler          = "lambda/GetFolloweesLambda.handler"
  source_code_hash = data.archive_file.lambda_package.output_base64sha256

  layers = [aws_lambda_layer_version.dependencies.arn]
}

#########################
# API GATEWAY RESOURCES #
#########################

# REST API
resource "aws_api_gateway_rest_api" "tweeter_api" {
  name        = "TweeterAPI"
  description = "API for Tweeter application"

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

# Resource for GET Followees endpoint
resource "aws_api_gateway_resource" "get_followees" {
  rest_api_id = aws_api_gateway_rest_api.tweeter_api.id
  parent_id   = aws_api_gateway_rest_api.tweeter_api.root_resource_id
  path_part   = "getfollowees"
}

#########################
# API GATEWAY METHODS   #
#########################

# POST method for getting followees
resource "aws_api_gateway_method" "post_get_followees" {
  rest_api_id      = aws_api_gateway_rest_api.tweeter_api.id
  resource_id      = aws_api_gateway_resource.get_followees.id
  http_method      = "POST"
  authorization    = "NONE"
  api_key_required = false
}

# OPTIONS method for CORS preflight requests
resource "aws_api_gateway_method" "options_get_followees" {
  rest_api_id      = aws_api_gateway_rest_api.tweeter_api.id
  resource_id      = aws_api_gateway_resource.get_followees.id
  http_method      = "OPTIONS"
  authorization    = "NONE"
  api_key_required = false
}

#########################
# API GATEWAY INTEGRATIONS #
#########################

# POST integration with Lambda function
resource "aws_api_gateway_integration" "post_get_followees_integration" {
  rest_api_id             = aws_api_gateway_rest_api.tweeter_api.id
  resource_id             = aws_api_gateway_resource.get_followees.id
  http_method             = aws_api_gateway_method.post_get_followees.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.get_followees.invoke_arn

  timeout_milliseconds = 29000
}

# OPTIONS integration (MOCK) for CORS preflight
resource "aws_api_gateway_integration" "options_get_followees_integration" {
  rest_api_id = aws_api_gateway_rest_api.tweeter_api.id
  resource_id = aws_api_gateway_resource.get_followees.id
  http_method = aws_api_gateway_method.options_get_followees.http_method
  type        = "MOCK"

  # Return empty 200 response for CORS preflight
  passthrough_behavior = "WHEN_NO_MATCH"
  request_templates = {
    "application/json" = "{ \"statusCode\": 200 }"
  }
}

#########################
# API GATEWAY METHOD RESPONSES #
#########################

# POST method response (200 OK)
resource "aws_api_gateway_method_response" "post_get_followees_200" {
  rest_api_id = aws_api_gateway_rest_api.tweeter_api.id
  resource_id = aws_api_gateway_resource.get_followees.id
  http_method = aws_api_gateway_method.post_get_followees.http_method
  status_code = "200"

  response_models = {
    "application/json" = "Empty"
  }

  response_parameters = local.cors_method_response_parameters
}

# OPTIONS method response (200 OK) for CORS
resource "aws_api_gateway_method_response" "options_get_followees_200" {
  rest_api_id = aws_api_gateway_rest_api.tweeter_api.id
  resource_id = aws_api_gateway_resource.get_followees.id
  http_method = aws_api_gateway_method.options_get_followees.http_method
  status_code = "200"

  response_models = {
    "application/json" = "Empty"
  }

  response_parameters = local.cors_method_response_parameters
}

# Error responses (4xx and 5xx)
resource "aws_api_gateway_method_response" "error_responses" {
  for_each = local.error_responses

  rest_api_id = aws_api_gateway_rest_api.tweeter_api.id
  resource_id = aws_api_gateway_resource.get_followees.id
  http_method = aws_api_gateway_method.post_get_followees.http_method
  status_code = each.key

  response_models = {
    "application/json" = "Empty"
  }

  response_parameters = local.cors_method_response_parameters
}

#########################
# API GATEWAY INTEGRATION RESPONSES #
#########################

# POST integration response (200 OK)
resource "aws_api_gateway_integration_response" "post_get_followees_200" {
  depends_on = [aws_api_gateway_integration.post_get_followees_integration]

  rest_api_id = aws_api_gateway_rest_api.tweeter_api.id
  resource_id = aws_api_gateway_resource.get_followees.id
  http_method = aws_api_gateway_method.post_get_followees.http_method
  status_code = aws_api_gateway_method_response.post_get_followees_200.status_code

  response_parameters = local.cors_integration_response_parameters
}

# OPTIONS integration response (200 OK) for CORS
resource "aws_api_gateway_integration_response" "options_get_followees_200" {
  depends_on = [aws_api_gateway_integration.options_get_followees_integration]

  rest_api_id = aws_api_gateway_rest_api.tweeter_api.id
  resource_id = aws_api_gateway_resource.get_followees.id
  http_method = aws_api_gateway_method.options_get_followees.http_method
  status_code = aws_api_gateway_method_response.options_get_followees_200.status_code

  response_parameters = local.cors_integration_response_parameters
  response_templates = {
    "application/json" = ""
  }
}

# Error responses integration (4xx and 5xx)
resource "aws_api_gateway_integration_response" "error_responses" {
  for_each = local.error_responses

  depends_on = [aws_api_gateway_integration.post_get_followees_integration]

  rest_api_id = aws_api_gateway_rest_api.tweeter_api.id
  resource_id = aws_api_gateway_resource.get_followees.id
  http_method = aws_api_gateway_method.post_get_followees.http_method
  status_code = aws_api_gateway_method_response.error_responses[each.key].status_code

  selection_pattern = each.value.selection_pattern

  response_parameters = local.cors_integration_response_parameters
}

#########################
# API GATEWAY DEPLOYMENT #
#########################

# API Deployment
resource "aws_api_gateway_deployment" "tweeter_api_deployment" {
  rest_api_id = aws_api_gateway_rest_api.tweeter_api.id

  # Deployment must depend on ALL resources including methods and integrations
  depends_on = [
    # POST method resources
    aws_api_gateway_integration.post_get_followees_integration,
    aws_api_gateway_integration_response.post_get_followees_200,
    aws_api_gateway_method_response.post_get_followees_200,
    aws_api_gateway_method_response.error_responses,
    aws_api_gateway_integration_response.error_responses,

    # OPTIONS method resources (CORS)
    aws_api_gateway_method.options_get_followees,
    aws_api_gateway_method_response.options_get_followees_200,
    aws_api_gateway_integration.options_get_followees_integration,
    aws_api_gateway_integration_response.options_get_followees_200
  ]
}

# API Stage
resource "aws_api_gateway_stage" "tweeter_api_stage" {
  deployment_id = aws_api_gateway_deployment.tweeter_api_deployment.id
  rest_api_id   = aws_api_gateway_rest_api.tweeter_api.id
  stage_name    = "dev"
}

#########################
# LAMBDA PERMISSIONS    #
#########################

# Grant API Gateway permission to invoke Lambda function
resource "aws_lambda_permission" "apigateway_lambda_invoke" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_followees.function_name
  principal     = "apigateway.amazonaws.com"

  # Restrict to our specific API Gateway
  source_arn = "${aws_api_gateway_rest_api.tweeter_api.execution_arn}/*"
}