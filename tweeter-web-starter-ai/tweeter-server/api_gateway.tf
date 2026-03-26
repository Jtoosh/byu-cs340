resource "aws_api_gateway_rest_api" "TweeterAPI" {
  name = "TweeterAPI_ai"
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
  type                    = "AWS"
  integration_http_method = "POST"
  content_handling        = "CONVERT_TO_TEXT"
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

resource "aws_api_gateway_method_response" "response_200" {
  for_each            = aws_api_gateway_resource.Resources
  rest_api_id         = aws_api_gateway_rest_api.TweeterAPI.id
  resource_id         = each.value.id
  http_method         = aws_api_gateway_method.Method[each.key].http_method
  status_code         = "200"
  response_models     = { "application/json" = "Empty" }
  response_parameters = local.cors_method_response_parameters
}

resource "aws_api_gateway_method_response" "options_200" {
  for_each            = aws_api_gateway_resource.Resources
  rest_api_id         = aws_api_gateway_rest_api.TweeterAPI.id
  resource_id         = each.value.id
  http_method         = aws_api_gateway_method.options[each.key].http_method
  status_code         = "200"
  response_models     = { "application/json" = "Empty" }
  response_parameters = local.cors_method_response_parameters
}

resource "aws_api_gateway_method_response" "response400" {
  for_each            = aws_api_gateway_resource.Resources
  rest_api_id         = aws_api_gateway_rest_api.TweeterAPI.id
  resource_id         = each.value.id
  http_method         = aws_api_gateway_method.Method[each.key].http_method
  status_code         = "400"
  response_models     = { "application/json" = "Empty" }
  response_parameters = local.cors_method_response_parameters
}

resource "aws_api_gateway_method_response" "response500" {
  for_each            = aws_api_gateway_resource.Resources
  rest_api_id         = aws_api_gateway_rest_api.TweeterAPI.id
  resource_id         = each.value.id
  http_method         = aws_api_gateway_method.Method[each.key].http_method
  status_code         = "500"
  response_models     = { "application/json" = "Empty" }
  response_parameters = local.cors_method_response_parameters
}

resource "aws_api_gateway_integration_response" "response_200Integration" {
  depends_on          = [aws_api_gateway_integration.MethodIntegration]
  for_each            = aws_api_gateway_resource.Resources
  rest_api_id         = aws_api_gateway_rest_api.TweeterAPI.id
  resource_id         = each.value.id
  http_method         = aws_api_gateway_method_response.response_200[each.key].http_method
  status_code         = aws_api_gateway_method_response.response_200[each.key].status_code
  response_parameters = local.cors_integration_response_parameters
}

resource "aws_api_gateway_integration_response" "options_integration" {
  depends_on          = [aws_api_gateway_integration.options]
  for_each            = aws_api_gateway_resource.Resources
  rest_api_id         = aws_api_gateway_rest_api.TweeterAPI.id
  resource_id         = each.value.id
  http_method         = aws_api_gateway_method.options[each.key].http_method
  status_code         = aws_api_gateway_method_response.options_200[each.key].status_code
  response_parameters = local.cors_integration_response_parameters
  response_templates = {
    "application/json" = ""
  }
}

resource "aws_api_gateway_integration_response" "error_response400" {
  depends_on          = [aws_api_gateway_integration.MethodIntegration]
  for_each            = aws_api_gateway_resource.Resources
  rest_api_id         = aws_api_gateway_rest_api.TweeterAPI.id
  resource_id         = each.value.id
  http_method         = aws_api_gateway_method_response.response400[each.key].http_method
  status_code         = aws_api_gateway_method_response.response400[each.key].status_code
  selection_pattern   = ".*\\[400\\].*"
  response_parameters = local.cors_integration_response_parameters
}

resource "aws_api_gateway_integration_response" "error_response500" {
  depends_on          = [aws_api_gateway_integration.MethodIntegration]
  for_each            = aws_api_gateway_resource.Resources
  rest_api_id         = aws_api_gateway_rest_api.TweeterAPI.id
  resource_id         = each.value.id
  http_method         = aws_api_gateway_method_response.response500[each.key].http_method
  status_code         = aws_api_gateway_method_response.response500[each.key].status_code
  selection_pattern   = ".*\\[500\\].*"
  response_parameters = local.cors_integration_response_parameters
}

resource "aws_api_gateway_deployment" "TweeterAPIDeployment" {
  rest_api_id = aws_api_gateway_rest_api.TweeterAPI.id
  triggers = {
    redeployment = sha1(jsonencode([
      values(aws_api_gateway_resource.Resources),
      values(aws_api_gateway_method.Method),
      values(aws_api_gateway_method.options),
      values(aws_api_gateway_integration.MethodIntegration),
      values(aws_api_gateway_integration.options),
    ]))
  }
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "TweeterAPIStage" {
  deployment_id = aws_api_gateway_deployment.TweeterAPIDeployment.id
  rest_api_id   = aws_api_gateway_rest_api.TweeterAPI.id
  stage_name    = "dev"
}
