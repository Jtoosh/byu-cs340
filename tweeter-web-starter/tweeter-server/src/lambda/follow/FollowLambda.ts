import {
  FollowActionRequest,
  FollowActionProxyResponse,
  UnauthorizedError,
  ServerError,
  corsHeaders,
} from "tweeter-shared";
import { FollowService } from "../../service/FollowService";
import { DynamoDAOFactory } from "../../data/factory/DynamoDAOFactory";
import { AuthenticationService } from "../../service/AuthenticationService";

export const handler = async (
  request: FollowActionRequest
): Promise<FollowActionProxyResponse> => {
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
      success: true,
      message: null,
      targetUserFollowerCount: followerCount,
      targetUserFolloweeCount: followeeCount,
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
        targetUserFollowerCount: 0,
        targetUserFolloweeCount: 0,
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
        targetUserFollowerCount: 0,
        targetUserFolloweeCount: 0,
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
      targetUserFollowerCount: 0,
      targetUserFolloweeCount: 0,
    };
  }
};
