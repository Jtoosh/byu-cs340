import {
  AuthRequest,
  AuthProxyResponse,
  UnauthorizedError,
  NotFoundError,
  ServerError,
  corsHeaders,
} from "tweeter-shared";
import { UserService } from "../../service/UserService";
import { DynamoDAOFactory } from "../../data/factory/DynamoDAOFactory";
import { AuthToken } from "tweeter-shared";

export const handler = async (
  request: AuthRequest
): Promise<AuthProxyResponse> => {
  const userService = new UserService(new DynamoDAOFactory());

  try {
    const [userDto, authDto] = await userService.login(
      request.alias,
      request.password
    );

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        user: userDto,
        authToken: authDto,
        message: null,
      }),
      success: true,
      message: null,
      user: userDto,
      authToken: authDto,
    };
  } catch (error :any) {
    if (error instanceof NotFoundError) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          message: error.message,
        }),
        success: false,
        message: error.message,
        user: null,
        authToken: null
      };
    }
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
        user: null,
        authToken: null
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
        user: null,
        authToken: null
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
      user: null,
      authToken: null
    };
  }
};
