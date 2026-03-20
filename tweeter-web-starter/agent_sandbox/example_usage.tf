# Example usage of the API Gateway Method Module

#########################
# POST Method Example   #
#########################

module "post_getfollowees" {
  source                  = "../tweeter-server/api_gateway_method_module"
  rest_api_id             = aws_api_gateway_rest_api.TweeterAPI.id
  resource_id             = aws_api_gateway_resource.GetFollowees.id
  http_method             = "POST"
  authorization           = "NONE"
  integration_type        = "AWS"
  integration_http_method = "POST"
  integration_uri         = aws_lambda_function.GetFolloweesLambda.invoke_arn
  content_handling        = "CONVERT_TO_TEXT"

  # Optional: Add custom response headers beyond CORS
  additional_method_response_headers = {
    "method.response.header.X-Custom-Header" = "'custom-value'"
  }

  additional_integration_response_headers = {
    "method.response.header.X-Backend-Version" = "'1.0'"
  }

  # Custom error codes if needed (defaults to [400, 500])
  error_codes = [400, 500]

  # Custom error selection patterns if needed
  error_selection_patterns = {
    400 = ".*\\[ClientError\\].*"
    500 = ".*\\[InternalError\\].*"
  }
}

#########################
# OPTIONS Method Example #
#########################

module "options_getfollowees" {
  source           = "../tweeter-server/api_gateway_method_module"
  rest_api_id      = aws_api_gateway_rest_api.TweeterAPI.id
  resource_id      = aws_api_gateway_resource.GetFollowees.id
  http_method      = "OPTIONS"
  authorization    = "NONE"
  integration_type = "MOCK" # OPTIONS typically uses MOCK integration

  # For MOCK integration, we need to specify the integration HTTP method
  # but it's not actually used, so we can set it to anything
  integration_http_method = "OPTIONS"

  # For OPTIONS, we typically don't need a backend URI since it's MOCK
  integration_uri = ""

  # Custom CORS values if needed (uses defaults if not specified)
  cors_allow_origin  = "'*'"
  cors_allow_headers = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
  cors_allow_methods = "'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'"
}

#########################
# GET Method Example    #
#########################

module "get_user_profile" {
  source           = "../tweeter-server/api_gateway_method_module"
  rest_api_id      = aws_api_gateway_rest_api.TweeterAPI.id
  resource_id      = aws_api_gateway_resource.UserProfile.id
  http_method      = "GET"
  authorization    = "NONE"
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.GetUserProfile.invoke_arn

  # AWS_PROXY integration typically doesn't need content handling or request templates
  content_handling  = ""
  request_templates = {}

  # For AWS_PROXY, method and integration responses are handled by the Lambda
  # but we still need the method response for CORS headers
  additional_method_response_headers = {
    "method.response.header.Access-Control-Allow-Origin"  = true
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
  }

  # Minimal error handling since Lambda handles errors
  error_codes = [400, 500]
}

#########################
# Using Module Outputs  #
#########################

# Example: Creating a deployment that depends on our API resources
resource "aws_api_gateway_deployment" "api_deployment" {
  rest_api_id = aws_api_gateway_rest_api.TweeterAPI.id

  # Deploy depends on all our API Gateway resources
  depends_on = [
    module.post_getfollowees.method_id,
    module.options_getfollowees.method_id,
    module.get_user_profile.method_id,

    # Also depend on integrations and responses
    module.post_getfollowees.integration_id,
    module.options_getfollowees.options_integration_id,
    module.get_user_profile.integration_id,

    # Method responses
    module.post_getfollowees.method_response_200_id,
    module.options_getfollowees.options_method_id,
    module.get_user_profile.method_response_200_id,

    # Integration responses
    module.post_getfollowees.integration_response_200_id,
    module.options_getfollowees.options_integration_response_id,
    module.get_user_profile.integration_response_200_id,

    # Error responses
    module.post_getfollowees.method_response_error_ids,
    module.options_getfollowees.method_response_error_ids,
    module.get_user_profile.method_response_error_ids,

    module.post_getfollowees.integration_response_error_ids,
    module.options_getfollowees.integration_response_error_ids,
    module.get_user_profile.integration_response_error_ids
  ]
}

# Separate stage resource
resource "aws_api_gateway_stage" "dev_stage" {
  deployment_id = aws_api_gateway_deployment.api_deployment.id
  rest_api_id   = aws_api_gateway_rest_api.TweeterAPI.id
  stage_name    = "dev"
}

# Example: Lambda permission for API Gateway to invoke Lambda
resource "aws_lambda_permission" "apigateway_post_getfollowees" {
  statement_id  = "AllowAPIGatewayInvokePost"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.GetFolloweesLambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.TweeterAPI.execution_arn}/*"
}

# Example: Lambda permission for GET endpoint
resource "aws_lambda_permission" "apigateway_get_userprofile" {
  statement_id  = "AllowAPIGatewayInvokeGet"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.GetUserProfile.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.TweeterAPI.execution_arn}/*"
}