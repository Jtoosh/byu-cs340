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
  source_dir = "${path.module}/dist/"
  output_path = "${path.module}/package/backend.zip"
}

resource "archive_file" "layer_package" {
  type        = "zip"
  source_dir = "${path.module}/layer"
  output_path = "${path.module}/package/dependencies/layer.zip"
}

resource "aws_lambda_layer_version" "dependencies" {
  depends_on = [ archive_file.layer_package ]
  filename = archive_file.layer_package.output_path
  layer_name = "tweeter_server_layer"
  source_code_hash = archive_file.layer_package.output_base64sha256
}

resource "aws_lambda_function" "GetFolloweesLambda" {
  depends_on       = [data.archive_file.lambda_package]
  function_name    = "GetFolloweesLambda"
  role             = aws_iam_role.backend_lambda_handler.arn
  filename         = data.archive_file.lambda_package.output_path
  runtime          = "nodejs20.x"
  handler          = "lambda/GetFolloweesLambda.handler"
  layers = [ aws_lambda_layer_version.dependencies.arn ]
  source_code_hash = data.archive_file.lambda_package.output_base64sha256
}

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
}

resource "aws_api_gateway_integration_response" "response_200Integration" {
  depends_on  = [aws_api_gateway_integration.loadMoreFolloweesIntegration]
  rest_api_id = aws_api_gateway_rest_api.TweeterAPI.id
  resource_id = aws_api_gateway_resource.GetFollowees.id
  http_method = aws_api_gateway_method.loadMoreFollowees.http_method
  status_code = aws_api_gateway_method_response.response_200.status_code
}

resource "aws_api_gateway_deployment" "TweeterAPIDeployment" {
  rest_api_id = aws_api_gateway_rest_api.TweeterAPI.id
  depends_on  = [aws_api_gateway_integration.loadMoreFolloweesIntegration, aws_api_gateway_integration_response.response_200Integration, aws_api_gateway_method_response.response_200]
}

resource "aws_api_gateway_stage" "TweeterAPIStage" {
  deployment_id = aws_api_gateway_deployment.TweeterAPIDeployment.id
  rest_api_id   = aws_api_gateway_rest_api.TweeterAPI.id
  stage_name    = "dev"
}

resource "aws_lambda_permission" "runPermissions" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.GetFolloweesLambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.TweeterAPI.execution_arn}/*"
}
