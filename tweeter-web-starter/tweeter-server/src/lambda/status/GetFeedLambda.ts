import {
  PagedItemRequest,
  StatusDto,
  UnauthorizedError,
  ServerError,
  corsHeaders,
} from "tweeter-shared";
import { StatusService } from "../../service/StatusService";
import { DynamoDAOFactory } from "../../data/factory/DynamoDAOFactory";
import { AuthenticationService } from "../../service/AuthenticationService";

interface ApiGatewayResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

export const handler = async (event: any): Promise<ApiGatewayResponse> => {
  const request: PagedItemRequest<StatusDto> = JSON.parse(event.body);
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
    };
  } catch (error: any) {
    if (error instanceof UnauthorizedError) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          message: error.message,
        }),
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
      };
    }
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        message: "Internal server error",
      }),
    };
  }
};
