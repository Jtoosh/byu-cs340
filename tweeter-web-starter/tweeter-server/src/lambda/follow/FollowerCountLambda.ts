import {
  FollowCountRequest,
  FollowCountProxyResponse,
  UnauthorizedError,
  ServerError,
  corsHeaders,
} from "tweeter-shared";
import { FollowService } from "../../service/FollowService";
import { DynamoDAOFactory } from "../../data/factory/DynamoDAOFactory";

export const handler = async (
  request: FollowCountRequest
): Promise<FollowCountProxyResponse> => {
  const followService = new FollowService(new DynamoDAOFactory());

  try {
    const count = await followService.getFollowerCount(
      request.token,
      request.targetUser
    );

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        count: count,
        message: null,
      }),
      success: true,
      message: null,
      count: count,
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
        count: 0,
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
        count: 0,
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
      count: 0,
    };
  }
};
