import {
  FollowerStatusRequest,
  FollowerStatusProxyResponse,
  UnauthorizedError,
  ServerError,
  corsHeaders,
} from "tweeter-shared";
import { FollowService } from "../../service/FollowService";
import { DynamoDAOFactory } from "../../data/factory/DynamoDAOFactory";

export const handler = async (
  request: FollowerStatusRequest
): Promise<FollowerStatusProxyResponse> => {
  const followService = new FollowService(new DynamoDAOFactory());

  try {
    const isFollower = await followService.getIsFollowerStatus(
      request.token,
      request.user,
      request.targetUser
    );

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        isFollower: isFollower,
        message: null,
      }),
      success: true,
      message: null,
      isFollower: isFollower,
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
        isFollower: false,
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
        isFollower: false,
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
      isFollower: false,
    };
  }
};
