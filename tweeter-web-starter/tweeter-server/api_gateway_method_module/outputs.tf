output "method_id" {
  description = "The ID of the API Gateway Method"
  value       = aws_api_gateway_method.this.id
}

output "integration_id" {
  description = "The ID of the API Gateway Integration"
  value       = aws_api_gateway_integration.this.id
}

output "method_response_200_id" {
  description = "The ID of the 200 Method Response"
  value       = aws_api_gateway_method_response.response200.id
}

output "integration_response_200_id" {
  description = "The ID of the 200 Integration Response"
  value       = aws_api_gateway_integration_response.integration_resp200.id
}

# Outputs for error responses (if any)
output "method_response_error_ids" {
  description = "Map of error status codes to Method Response IDs"
  value       = { for k, v in aws_api_gateway_method_response.error : k => v.id }
}

output "integration_response_error_ids" {
  description = "Map of error status codes to Integration Response IDs"
  value       = { for k, v in aws_api_gateway_integration_response.error : k => v.id }
}

# Special outputs for OPTIONS method
output "options_method_id" {
  description = "The ID of the OPTIONS Method (if applicable)"
  value       = length(aws_api_gateway_method_response.options_200) > 0 ? aws_api_gateway_method_response.options_200[0].id : null
}

output "options_integration_id" {
  description = "The ID of the OPTIONS Integration (if applicable)"
  value       = length(aws_api_gateway_integration.options_mock) > 0 ? aws_api_gateway_integration.options_mock[0].id : null
}

output "options_integration_response_id" {
  description = "The ID of the OPTIONS Integration Response (if applicable)"
  value       = length(aws_api_gateway_integration_response.options_200) > 0 ? aws_api_gateway_integration_response.options_200[0].id : null
}