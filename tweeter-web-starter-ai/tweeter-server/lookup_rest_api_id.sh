#!/bin/bash
# Script to lookup API Gateway REST API ID by name
# Expects JSON input with: api_name
# Outputs JSON with the REST API ID
set -euo pipefail
# Read input from stdin (Terraform external data source format)
input=$(cat)
api_name=$(echo "$input" | jq -r .api_name)
# Look up REST API by name
# Using get-rest-apis with query to find by name
result=$(aws apigateway get-rest-apis \
  --query "items[?name=='$api_name'].id | [0]" \
  --output text 2>/dev/null || echo "None")
# Output result in format expected by Terraform external data source
if [ "$result" != "None" ] && [ -n "$result" ] && [ "$result" != "" ]; then
  echo "{\"id\":\"$result\"}"
else
  # Return empty ID - Terraform will create the resource and the import will happen on apply
  echo "{\"id\":\"\"}"
fi