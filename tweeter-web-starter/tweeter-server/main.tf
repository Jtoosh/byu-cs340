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
data "archive_file" "example" {
  type        = "zip"
  source_file = "./dist/lambda/GetFolloweesLambda.js"
  output_path = "./package/lambda/function.zip"
}

resource "aws_lambda_function" "GetFolloweesLambda" {
  function_name    = "GetFolloweesLambda"
  role             = aws_iam_role.backend_lambda_handler.arn
  filename         = data.archive_file.example.output_path
  runtime          = "nodejs20.x"
  handler          = "handler"
  source_code_hash = data.archive_file.example.output_base64sha256
}
