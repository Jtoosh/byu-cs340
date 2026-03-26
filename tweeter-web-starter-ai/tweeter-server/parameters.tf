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
