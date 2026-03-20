variable "rest_api_id" {
  description = "The ID of the REST API"
  type        = string
}

variable "resource_id" {
  description = "The ID of the resource"
  type        = string
}

variable "http_method" {
  description = "HTTP method for the endpoint (e.g., GET, POST, PUT, DELETE, OPTIONS)"
  type        = string
}

variable "authorization" {
  description = "Authorization type for the method"
  type        = string
  default     = "NONE"
}

variable "integration_type" {
  description = "Integration type (AWS, AWS_PROXY, MOCK, HTTP, HTTP_PROXY)"
  type        = string
}

variable "integration_uri" {
  description = "URI for the integration (required for AWS and HTTP types)"
  type        = string
  default     = ""
}

variable "integration_http_method" {
  description = "HTTP method for the integration"
  type        = string
  default     = ""
}

variable "content_handling" {
  description = "How to handle content conversion for responses (CONVERT_TO_BINARY, CONVERT_TO_TEXT, or empty)"
  type        = string
  default     = ""
}

variable "request_templates" {
  description = "Request templates for the integration (key: content-type, value: template)"
  type        = map(string)
  default     = {}
}

variable "cors_allow_origin" {
  description = "Value for Access-Control-Allow-Origin header in CORS responses"
  type        = string
  default     = "'*'"
}

variable "cors_allow_headers" {
  description = "Value for Access-Control-Allow-Headers header in CORS responses"
  type        = string
  default     = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
}

variable "cors_allow_methods" {
  description = "Value for Access-Control-Allow-Methods header in CORS responses"
  type        = string
  default     = "'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'"
}

variable "additional_method_response_headers" {
  description = "Additional response headers to include in method responses (beyond CORS headers)"
  type        = map(string)
  default     = {}
}

variable "additional_integration_response_headers" {
  description = "Additional response headers to include in integration responses (beyond CORS headers)"
  type        = map(string)
  default     = {}
}

variable "error_codes" {
  description = "List of error status codes to create responses for (e.g., [400, 500])"
  type        = list(string)
  default     = ["400", "500"]
}

variable "error_selection_patterns" {
  description = "Map of error status codes to selection patterns for integration responses"
  type        = map(string)
  default = {
    400 = ".*\\[400\\].*"
    500 = ".*\\[500\\].*"
  }
}