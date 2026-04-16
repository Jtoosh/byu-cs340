import {
  UserRequest,
  NotFoundError,
  ServerError,
  corsHeaders,
} from "tweeter-shared";
import { UserService } from "../../service/UserService";
import { DynamoDAOFactory } from "../../data/factory/DynamoDAOFactory";

interface ApiGatewayResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

export const handler = async (event: any): Promise<ApiGatewayResponse> => {
  const request: UserRequest = JSON.parse(event.body);
  const userService = new UserService(new DynamoDAOFactory());

  try {
    const targetUser = await userService.getUser(
      request.token,
      request.targetUserAlias
    );

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        user: targetUser,
        message: null,
      }),
    };
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return {
        statusCode: 404,
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
