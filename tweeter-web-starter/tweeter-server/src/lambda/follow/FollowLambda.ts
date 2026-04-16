import {
  FollowActionRequest,
  UnauthorizedError,
  ServerError,
  corsHeaders,
} from "tweeter-shared";
import { FollowService } from "../../service/FollowService";
import { DynamoDAOFactory } from "../../data/factory/DynamoDAOFactory";
import { AuthenticationService } from "../../service/AuthenticationService";

interface ApiGatewayResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

export const handler = async (event: any): Promise<ApiGatewayResponse> => {
  const request: FollowActionRequest = JSON.parse(event.body);
  const authService = new AuthenticationService(new DynamoDAOFactory());
  const followService = new FollowService(new DynamoDAOFactory());

  try {
    await authService.authenticateToken(request.token, request.sourceUser.alias);

    const [followerCount, followeeCount] =
      request.actionType === "Follow"
        ? await followService.follow(
            request.token,
            request.targetUser,
            request.sourceUser
          )
        : await followService.unfollow(
            request.token,
            request.targetUser,
            request.sourceUser
          );

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        targetUserFollowerCount: followerCount,
        targetUserFolloweeCount: followeeCount,
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
