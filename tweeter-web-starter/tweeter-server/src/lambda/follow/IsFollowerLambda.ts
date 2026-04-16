import {
  FollowerStatusRequest,
  UnauthorizedError,
  ServerError,
  corsHeaders,
} from "tweeter-shared";
import { FollowService } from "../../service/FollowService";
import { DynamoDAOFactory } from "../../data/factory/DynamoDAOFactory";

interface ApiGatewayResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

export const handler = async (event: any): Promise<ApiGatewayResponse> => {
  const request: FollowerStatusRequest = JSON.parse(event.body);
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
