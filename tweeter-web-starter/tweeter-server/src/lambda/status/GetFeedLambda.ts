import {
  PagedItemRequest,
  PagedItemProxyResponse,
  StatusDto,
  UnauthorizedError,
  ServerError,
  corsHeaders,
} from "tweeter-shared";
import { StatusService } from "../../service/StatusService";
import { DynamoDAOFactory } from "../../data/factory/DynamoDAOFactory";
import { AuthenticationService } from "../../service/AuthenticationService";

export const handler = async (
  request: PagedItemRequest<StatusDto>
): Promise<PagedItemProxyResponse<StatusDto>> => {
  const statusService = new StatusService(new DynamoDAOFactory());
  const authenticationService = new AuthenticationService(new DynamoDAOFactory());

  try {
    await authenticationService.authenticateToken(request.token, request.userAlias);
    
    const [items, hasMore] = await statusService.loadMoreFeedItems(
      request.token,
      request.userAlias,
      request.pageSize,
      request.lastItem
    );

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        items: items,
        hasMore: hasMore,
        message: null,
      }),
      success: true,
      message: null,
      items: items,
      hasMore: hasMore,
    };
  } catch (error:any) {
    if (error instanceof UnauthorizedError) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          message: error.message,
        }),
        success: false,
        message: error.message,
        items: null,
        hasMore: false,
      };
    }
    if (error instanceof ServerError) {
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          message: error.message,
        }),
        success: false,
        message: error.message,
        items: null,
        hasMore: false,
      };
    }
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        message: "Internal server error",
      }),
      success: false,
      message: "Internal server error",
      items: null,
      hasMore: false,
    };
  }
};
