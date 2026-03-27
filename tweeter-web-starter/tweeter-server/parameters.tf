variable "lambda" {
  type = map(object({
    handler = string
  }))
  default = {}
}

variable "api_resource" {
  type = map(object({
    pathPart = string
  }))
  default = {}
}

variable "api_documentation" {
  type = map(object({
    description       = string
    response_400_desc = string
    response_500_desc = string
  }))
  default = {}
}
