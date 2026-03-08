terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.4.0"
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

resource "aws_lambda_function" "function_1" {
  function_name    = "yes"
  role             = aws_iam_role.backend_lambda_handler.arn
  filename         = "./src/handler.lambda/ <TODO Fill with Lambda function .ts file>"
  runtime          = "Node.js 20.x"
  handler          = "<TODO add handler name>"
  source_code_hash = filebase64sha256("./src/handler.lambda/ <TODO Fill with Lambda function .ts file>")
}