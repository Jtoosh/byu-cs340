data "archive_file" "lambda_package" {
  type        = "zip"
  source_dir  = "${path.module}/dist/"
  output_path = "${path.module}/package/backend.zip"
}

resource "archive_file" "layer_package" {
  type        = "zip"
  source_dir  = "${path.module}/layer/nodejs"
  output_path = "${path.module}/package/dependencies/layer.zip"
}

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
  timeout          = 30
}

resource "aws_lambda_permission" "runPermissions" {
  for_each      = aws_lambda_function.Lambdas
  action        = "lambda:InvokeFunction"
  function_name = each.value.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.TweeterAPI.execution_arn}/*"
}
