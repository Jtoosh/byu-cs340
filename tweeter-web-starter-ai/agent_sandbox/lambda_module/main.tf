data "archive_file" "function_zip" {
  type        = "zip"
  source_dir  = var.source_path
  output_path = "${path.module}/package/${var.function_name}.zip"
}

resource "aws_iam_role" "lambda_role" {
  name = "${var.function_name}-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_lambda_function" "this" {
  function_name = var.function_name
  description   = var.description
  role          = aws_iam_role.lambda_role.arn
  filename      = data.archive_file.function_zip.output_path
  runtime       = var.runtime
  handler       = var.handler
  layers        = var.layers
  environment {
    variables = var.environment_variables
  }
  source_code_hash = data.archive_file.function_zip.output_base64sha256
}