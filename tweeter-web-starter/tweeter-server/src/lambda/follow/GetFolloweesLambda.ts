import {
  PagedItemRequest,
  PagedItemProxyResponse,
  UserDto,
  UnauthorizedError,
  ServerError,
  corsHeaders,
} from "tweeter-shared";
import { FollowService } from "../../service/FollowService";
import { DynamoDAOFactory } from "../../data/factory/DynamoDAOFactory";

export const handler = async (
  request: PagedItemRequest<UserDto>
): Promise<PagedItemProxyResponse<UserDto>> => {
  const followService = new FollowService(new DynamoDAOFactory());

  try {
    const [items, hasMore] = await followService.loadMoreFollowees(
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
