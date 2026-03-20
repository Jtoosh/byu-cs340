# The API Gateway Method
resource "aws_api_gateway_method" "this" {
  rest_api_id   = var.rest_api_id
  resource_id   = var.resource_id
  http_method   = var.http_method
  authorization = var.authorization
}

# The Integration
resource "aws_api_gateway_integration" "this" {
  rest_api_id             = var.rest_api_id
  resource_id             = var.resource_id
  http_method             = aws_api_gateway_method.this.http_method
  type                    = var.integration_type
  integration_http_method = var.integration_http_method != "" ? var.integration_http_method : aws_api_gateway_method.this.http_method
  uri                     = var.integration_uri
  content_handling        = var.content_handling != "" ? var.content_handling : null
  request_templates       = var.request_templates
}

# Method Response for 200 (Success)
resource "aws_api_gateway_method_response" "response200" {
  rest_api_id = var.rest_api_id
  resource_id = var.resource_id
  http_method = aws_api_gateway_method.this.http_method
  status_code = "200"
  response_models = {
    "application/json" = "Empty"
  }
  response_parameters = merge(
    {
      "method.response.header.Access-Control-Allow-Origin"  = true
      "method.response.header.Access-Control-Allow-Headers" = true
      "method.response.header.Access-Control-Allow-Methods" = true
    },
    var.additional_method_response_headers
  )
}

# Integration Response for 200 (Success)
resource "aws_api_gateway_integration_response" "integration_resp200" {
  depends_on  = [aws_api_gateway_integration.this]
  rest_api_id = var.rest_api_id
  resource_id = var.resource_id
  http_method = aws_api_gateway_method.this.http_method
  status_code = "200"
  response_parameters = merge(
    {
      "method.response.header.Access-Control-Allow-Origin"  = var.cors_allow_origin
      "method.response.header.Access-Control-Allow-Headers" = var.cors_allow_headers
      "method.response.header.Access-Control-Allow-Methods" = var.cors_allow_methods
    },
    var.additional_integration_response_headers
  )
  response_templates = {
    "application/json" = ""
  }
}

# Method Responses for Error Codes (400, 500, etc.)
resource "aws_api_gateway_method_response" "error" {
  for_each    = toset(var.error_codes)
  rest_api_id = var.rest_api_id
  resource_id = var.resource_id
  http_method = aws_api_gateway_method.this.http_method
  status_code = each.value
  response_models = {
    "application/json" = "Empty"
  }
  response_parameters = merge(
    {
      "method.response.header.Access-Control-Allow-Origin"  = true
      "method.response.header.Access-Control-Allow-Headers" = true
      "method.response.header.Access-Control-Allow-Methods" = true
    },
    var.additional_method_response_headers
  )
}

# Integration Responses for Error Codes (400, 500, etc.)
resource "aws_api_gateway_integration_response" "error" {
  for_each          = toset(var.error_codes)
  depends_on        = [aws_api_gateway_integration.this]
  rest_api_id       = var.rest_api_id
  resource_id       = var.resource_id
  http_method       = aws_api_gateway_method.this.http_method
  status_code       = each.value
  selection_pattern = lookup(var.error_selection_patterns, each.value, ".*\\${each.value}\\.*")
  response_parameters = merge(
    {
      "method.response.header.Access-Control-Allow-Origin"  = var.cors_allow_origin
      "method.response.header.Access-Control-Allow-Headers" = var.cors_allow_headers
      "method.response.header.Access-Control-Allow-Methods" = var.cors_allow_methods
    },
    var.additional_integration_response_headers
  )
  response_templates = {
    "application/json" = ""
  }
}

# Special handling for OPTIONS method (CORS preflight)
# This creates a MOCK integration for OPTIONS if the method is OPTIONS
resource "aws_api_gateway_integration" "options_mock" {
  count       = var.http_method == "OPTIONS" && var.integration_type == "MOCK" ? 1 : 0
  rest_api_id = var.rest_api_id
  resource_id = var.resource_id
  http_method = "OPTIONS"
  type        = "MOCK"
  request_templates = {
    "application/json" = "{ \"statusCode\": 200 }"
  }
}

resource "aws_api_gateway_method_response" "options_200" {
  count           = var.http_method == "OPTIONS" ? 1 : 0
  rest_api_id     = var.rest_api_id
  resource_id     = var.resource_id
  http_method     = "OPTIONS"
  status_code     = "200"
  response_models = { "application/json" = "Empty" }
  response_parameters = merge(
    {
      "method.response.header.Access-Control-Allow-Origin"  = true
      "method.response.header.Access-Control-Allow-Headers" = true
      "method.response.header.Access-Control-Allow-Methods" = true
    },
    var.additional_method_response_headers
  )
}

resource "aws_api_gateway_integration_response" "options_200" {
  count       = var.http_method == "OPTIONS" ? 1 : 0
  depends_on  = [aws_api_gateway_integration.options_mock[0]]
  rest_api_id = var.rest_api_id
  resource_id = var.resource_id
  http_method = "OPTIONS"
  status_code = "200"
  response_parameters = merge(
    {
      "method.response.header.Access-Control-Allow-Origin"  = var.cors_allow_origin
      "method.response.header.Access-Control-Allow-Headers" = var.cors_allow_headers
      "method.response.header.Access-Control-Allow-Methods" = var.cors_allow_methods
    },
    var.additional_integration_response_headers
  )
  response_templates = {
    "application/json" = ""
  }
}