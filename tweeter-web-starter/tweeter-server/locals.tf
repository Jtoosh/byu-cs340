locals {

  cors_allow_origin  = "'*'"
  cors_allow_headers = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
  cors_allow_methods = "'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'"

  error_codes = ["400","500"]

  error_responses = {
    "400" = ".*\\[400\\].*"

    "500" = ".*\\[500\\].*"
  }
}
