terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.30.0"
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
    "method.response.header.Access-Control-Allow-Origin" = true
  }

  cors_integration_response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }

  error_responses = {
    "400" = {
      selection_pattern = ".*\\[400\\].*"
    }
    "500" = {
      selection_pattern = ".*"
    }
  }
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

resource "aws_api_gateway_resource" "GetFollowees" {
  rest_api_id = aws_api_gateway_rest_api.TweeterAPI.id
  parent_id   = aws_api_gateway_rest_api.TweeterAPI.root_resource_id
  path_part   = "getfollowees"
}

resource "aws_api_gateway_method" "loadMoreFollowees" {
  rest_api_id   = aws_api_gateway_rest_api.TweeterAPI.id
  resource_id   = aws_api_gateway_resource.GetFollowees.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "loadMoreFolloweesIntegration" {
  rest_api_id             = aws_api_gateway_rest_api.TweeterAPI.id
  resource_id             = aws_api_gateway_resource.GetFollowees.id
  http_method             = aws_api_gateway_method.loadMoreFollowees.http_method
  type                    = "AWS"
  integration_http_method = "POST"
  content_handling        = "CONVERT_TO_TEXT"
  uri                     = aws_lambda_function.GetFolloweesLambda.invoke_arn
}

resource "aws_api_gateway_method_response" "response_200" {
  rest_api_id     = aws_api_gateway_rest_api.TweeterAPI.id
  resource_id     = aws_api_gateway_resource.GetFollowees.id
  http_method     = aws_api_gateway_method.loadMoreFollowees.http_method
  status_code     = "200"
  response_models = { "application/json" = "Empty" }
  response_parameters = local.cors_method_response_parameters
}

resource "aws_api_gateway_method_response" "error_responses" {
  for_each       = local.error_responses
  rest_api_id    = local.tweeter_api_id
  resource_id    = local.getfollowees_id
  http_method    = local.getfollowees_method
  status_code    = each.key
  response_models = { "application/json" = "Empty" }
  response_parameters = local.cors_method_response_parameters
}

resource "aws_api_gateway_integration_response" "response_200Integration" {
  depends_on  = [aws_api_gateway_integration.loadMoreFolloweesIntegration]
  rest_api_id = aws_api_gateway_rest_api.TweeterAPI.id
  resource_id = aws_api_gateway_resource.GetFollowees.id
  http_method = aws_api_gateway_method.loadMoreFollowees.http_method
  status_code = aws_api_gateway_method_response.response_200.status_code
  response_parameters = local.cors_integration_response_parameters
}

resource "aws_api_gateway_integration_response" "error_responses" {
  for_each   = local.error_responses
  depends_on = [aws_api_gateway_integration.loadMoreFolloweesIntegration]
  rest_api_id = local.tweeter_api_id
  resource_id = local.getfollowees_id
  http_method = local.getfollowees_method
  status_code = aws_api_gateway_method_response.error_responses[each.key].status_code
  selection_pattern = each.value.selection_pattern
  response_parameters = local.cors_integration_response_parameters
}

resource "aws_api_gateway_deployment" "TweeterAPIDeployment" {
  rest_api_id = aws_api_gateway_rest_api.TweeterAPI.id
  depends_on  = [
    aws_api_gateway_integration.loadMoreFolloweesIntegration,
    aws_api_gateway_integration_response.response_200Integration,
    aws_api_gateway_method_response.response_200,
    aws_api_gateway_method_response.error_responses,
    aws_api_gateway_integration_response.error_responses
  ]
}

# Documentation resources

import {
  to = aws_api_gateway_documentation_part.loadMoreFolloweesDoc
  id = "${aws_api_gateway_rest_api.TweeterAPI.id}/88rkwc"
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
  depends_on  = [
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
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.GetFolloweesLambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.TweeterAPI.execution_arn}/*"
}
