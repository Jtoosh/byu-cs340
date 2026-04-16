# Implementation Log: Lambda Proxy Integration with HTTP Status Codes

## Date: 2026-04-06

## Overview
Converting API Gateway from non-proxy integration (AWS) to proxy integration (AWS_PROXY) to enable proper HTTP status codes for error handling.

---

## Starting State

### Files Modified During Implementation

#### tweeter-shared (NEW FILES)
- `src/errors/UnauthorizedError.ts` - NEW
- `src/errors/BadRequestError.ts` - NEW
- `src/errors/NotFoundError.ts` - NEW
- `src/errors/ServerError.ts` - NEW
- `src/errors/index.ts` - NEW
- `src/proxy/ProxyResponses.ts` - NEW

#### tweeter-shared (MODIFIED)
- `src/index.ts` - Added exports for new error classes and proxy response interfaces

#### tweeter-server (MODIFIED)
- `src/service/UserService.ts`
- `src/data/DynamoDAO/DynamoUserDAO.ts`
- `src/data/DynamoDAO/DynamoAuthDAO.ts`
- `src/data/DynamoDAO/DynamoFeedDAO.ts`
- `src/lambda/user/RegisterLambda.ts`
- `src/lambda/user/LoginLambda.ts`
- `src/lambda/user/LogoutLambda.ts`
- `src/lambda/user/GetUserLambda.ts`
- `src/lambda/follow/FollowLambda.ts`
- `src/lambda/follow/GetFolloweesLambda.ts`
- `src/lambda/follow/GetFollowersLambda.ts`
- `src/lambda/follow/IsFollowerLambda.ts`
- `src/lambda/follow/FollowerCountLambda.ts`
- `src/lambda/follow/FolloweeCountLambda.ts`
- `src/lambda/status/GetFeedLambda.ts`
- `src/lambda/status/GetStoryLambda.ts`
- `src/lambda/status/PostStatusLambda.ts`
- `main.tf` - API Gateway integration changes + deprecated resource removal

#### tweeter-web (MODIFIED)
- `src/network/ClientCommunicator.ts`

---

## Changes Made

### 1. tweeter-shared: Error Classes (NEW FILES)

Created in `tweeter-shared/src/errors/`:

#### UnauthorizedError.ts
```typescript
export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
  }
}
```

#### BadRequestError.ts
```typescript
export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
  }
}
```

#### NotFoundError.ts
```typescript
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}
```

#### ServerError.ts
```typescript
export class ServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ServerError";
  }
}
```

#### index.ts
Exports all error classes.

---

### 2. tweeter-shared: Proxy Response Interfaces (NEW)

Created in `tweeter-shared/src/proxy/ProxyResponses.ts`:

Custom interfaces extending `APIGatewayProxyResult` with response fields:

| Interface | Fields |
|----------|--------|
| TweeterProxyResponse | statusCode, headers, body, success, message |
| AuthProxyResponse | + user, authToken |
| UserProxyResponse | + user |
| FollowActionProxyResponse | + targetUserFollowerCount, targetUserFolloweeCount |
| FollowerStatusProxyResponse | + isFollower |
| FollowCountProxyResponse | + count |
| PagedItemProxyResponse<T> | + items, hasMore |

---

### 3. tweeter-shared: Index Exports

Added to `src/index.ts`:
```typescript
// Errors
export { UnauthorizedError } from "./errors/UnauthorizedError";
export { BadRequestError } from "./errors/BadRequestError";
export { NotFoundError } from "./errors/NotFoundError";
export { ServerError } from "./errors/ServerError";

// Proxy Responses
export type { TweeterProxyResponse, AuthProxyResponse, UserProxyResponse, ... } from "./proxy/ProxyResponses";
```

---

### 4. Service/DAO Layer Changes

#### UserService.ts
- Changed `throw new Error("Unauthorized...")` → `throw new UnauthorizedError(...)`
- Changed `throw new Error("User not found...")` → `throw new NotFoundError(...)`

#### DynamoUserDAO.ts
- Changed `throw new Error("User not found")` → `throw new NotFoundError(...)`

#### DynamoAuthDAO.ts
- Changed `throw new Error("Unauthorized...")` → `throw new UnauthorizedError(...)`

#### DynamoFeedDAO.ts
- Changed `throw new Error("Failed to write...")` → `throw new ServerError(...)`

---

### 5. Lambda Handler Changes (14 files)

Each handler now:
1. Wraps logic in try-catch
2. Returns `APIGatewayProxyResult` structure
3. Catches specific error types and returns appropriate status codes
4. Uses custom proxy response interfaces

Pattern:
```typescript
export const handler = async (request: XxxRequest): Promise<SomeProxyResponse> => {
  try {
    const service = new XxxService(new DynamoDAOFactory());
    const result = await service.method(...);
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*", ... },
      body: JSON.stringify({ success: true, ...result, message: null }),
      success: true,
      message: null,
      ...result
    };
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return { statusCode: 401, headers: {...}, body: JSON.stringify({ success: false, message: error.message }) };
    }
    if (error instanceof BadRequestError) {
      return { statusCode: 400, headers: {...}, body: JSON.stringify({ success: false, message: error.message }) };
    }
    if (error instanceof NotFoundError) {
      return { statusCode: 404, headers: {...}, body: JSON.stringify({ success: false, message: error.message }) };
    }
    if (error instanceof ServerError) {
      return { statusCode: 500, headers: {...}, body: JSON.stringify({ success: false, message: error.message }) };
    }
    return { statusCode: 500, headers: {...}, body: JSON.stringify({ success: false, message: "Internal server error" }) };
  }
};
```

---

### 6. ClientCommunicator.ts

Changed line 43:
```typescript
// Before:
throw new Error(error.errorMessage);

// After:
throw new Error(error.message);
```

---

### 7. Terraform main.tf

#### Change 1: Integration Type
```hcl
# Before:
type = "AWS"
integration_http_method = "POST"

# After:
type = "AWS_PROXY"
```

#### Change 2: Removed Deprecated Resources
- `aws_api_gateway_integration.options`
- `aws_api_gateway_integration_response.response_200Integration`
- `aws_api_gateway_integration_response.options_integration`
- `aws_api_gateway_integration_response.error_response400`
- `aws_api_gateway_integration_response.error_response500`
- Simplified `aws_api_gateway_method_response` resources (removed 400/500 responses for non-OPTIONS methods)

#### Change 3: Deployment depends_on
Updated to remove references to removed resources.

---

## Rollback Instructions

To rollback to the original state:

1. **Restore tweeter-shared files**:
   - Delete `src/errors/` directory
   - Delete `src/proxy/` directory
   - Restore `src/index.ts` from git

2. **Restore tweeter-server files**:
   - Restore all modified service/DAO files from git
   - Restore all modified lambda handlers from git
   - Restore `main.tf` from git

3. **Restore tweeter-web files**:
   - Restore `ClientCommunicator.ts` from git

4. **Terraform**:
   - Run `terraform apply` to restore API Gateway configuration

---

## Status

- [x] Implementation log created
- [x] Error classes created
- [x] Proxy response interfaces created
- [x] Index exports updated
- [x] Service/DAO layers updated
- [x] Lambda handlers updated
- [x] ClientCommunicator updated
- [x] Terraform updated
- [ ] Validated with terraform validate
- [ ] Planned with terraform plan

## Implementation Completed

All tasks completed successfully.

### Terraform Plan Summary
- **14 to add** (new Lambda IAM policies for S3 access)
- **1 to change** (API Gateway stage - removing documentation_version)
- **140 to destroy** (deprecated API Gateway resources)

### Files Modified
- tweeter-shared/src/errors/*.ts (NEW)
- tweeter-shared/src/proxy/*.ts (NEW)
- tweeter-shared/src/index.ts (MODIFIED)
- tweeter-shared/package.json (MODIFIED - added @types/aws-lambda)
- tweeter-server/src/service/*.ts (MODIFIED - error classes)
- tweeter-server/src/data/DynamoDAO/*.ts (MODIFIED - error classes)
- tweeter-server/src/lambda/**/*.ts (MODIFIED - 13 handlers)
- tweeter-web/src/network/ClientCommunicator.ts (MODIFIED)
- tweeter-server/main.tf (MODIFIED - AWS_PROXY)
- tweeter-server/locals.tf (MODIFIED - removed unused locals)
