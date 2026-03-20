locals {
  tweeter_api_id      = aws_api_gateway_rest_api.TweeterAPI.id
  getfollowees_id     = aws_api_gateway_resource.GetFollowees.id
  getfollowees_method = aws_api_gateway_method.loadMoreFollowees.http_method

  cors_method_response_parameters = {
    "method.response.header.Access-Control-Allow-Origin"  = true
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
  }

  cors_integration_response_parameters = {
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'"
  }

  error_responses = {
    "400" = {
      selection_pattern = ".*\\[400\\].*"
    }
    "500" = {
      selection_pattern = ".*\\[500\\].*"
    }
  }
}
