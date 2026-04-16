import {
  LogoutRequest,
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
  const request: LogoutRequest = JSON.parse(event.body);
  const userService = new UserService(new DynamoDAOFactory());

  try {
    await userService.logOut(request.token);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        message: null,
      }),
    };
  } catch (error: any) {
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
