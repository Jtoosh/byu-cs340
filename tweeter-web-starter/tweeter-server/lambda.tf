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
  for_each = var.lambda
  depends_on       = [data.archive_file.lambda_package]
  function_name    = each.key
  role             = aws_iam_role.backend_lambda_handler.arn
  filename         = data.archive_file.lambda_package.output_path
  runtime          = "nodejs20.x"
  handler          = each.value.handler
  layers           = [aws_lambda_layer_version.dependencies.arn]
  source_code_hash = data.archive_file.lambda_package.output_base64sha256
}
