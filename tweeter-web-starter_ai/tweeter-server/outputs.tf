output "api_endpoint" {
  description = "Base URL of the API Gateway stage"
  value       = aws_api_gateway_stage.TweeterAPIStage.invoke_url
}

output "api_id" {
  description = "ID of the API Gateway REST API"
  value       = aws_api_gateway_rest_api.TweeterAPI.id
}

output "api_stage_name" {
  description = "Name of the API Gateway stage"
  value       = aws_api_gateway_stage.TweeterAPIStage.stage_name
}

output "lambda_function_arns" {
  description = "ARNs of the Lambda functions"
  value       = { for k, v in aws_lambda_function.Lambdas : k => v.arn }
}
