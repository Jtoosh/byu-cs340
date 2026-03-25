#!/bin/bash

# Script to lookup API Gateway documentation part ID by location
# Expects JSON input with: rest_api_id, path, method, type
# Outputs JSON with the documentation part ID
# Returns empty ID if not found (which allows Terraform to create the resource)

set -euo pipefail

# Read input from stdin (Terraform external data source format)
input=$(cat)
rest_api_id=$(echo "$input" | jq -r .rest_api_id)
path=$(echo "$input" | jq -r .path)
method=$(echo "$input" | jq -r .method)
type=$(echo "$input" | jq -r .type)

# Look up documentation parts matching the location
# Since get-documentation-parts doesn't support method/type filters directly,
# we'll get all parts and filter manually
all_parts=$(aws apigateway get-documentation-parts \
  --rest-api-id "$rest_api_id" \
  --limit 500 \
  --query 'items' \
  --output json 2>/dev/null || echo '[]')

# Find the part matching our location
result=$(echo "$all_parts" | jq -r --arg path "$path" --arg method "$method" --arg type "$type" \
  '.[] | select(.location.path == $path and .location.method == $method and .location.type == $type) | .id // empty' | head -1)

# Output result in format expected by Terraform external data source
if [ -n "$result" ] && [ "$result" != "null" ]; then
  echo "{\"id\":\"$result\"}"
else
  # Return empty ID - Terraform will create the resource and the import will happen on apply
  echo "{\"id\":\"\"}"
fi