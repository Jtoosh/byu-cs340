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
  shared_config_files      = ["~/.aws/config"]
  shared_credentials_files = ["~/.aws/credentials"]
  profile                  = "james-dev-school"
  region                   = "us-west-2"
}

data "aws_iam_policy_document" "role" {
  statement {
    effect = "Allow"
    principals {
      identifiers = ["lambda.amazonaws.com"]
      type        = "Service"
    }
    actions = ["sts:AssumeRole"]
  }
}

data "aws_iam_policy" "lambda_basic_execution" {
  arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role" "backend_lambda_handler" {
  assume_role_policy = data.aws_iam_policy_document.role.json
}

resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.backend_lambda_handler.name
  policy_arn = data.aws_iam_policy.lambda_basic_execution.arn
}
