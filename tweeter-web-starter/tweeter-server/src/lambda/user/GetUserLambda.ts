import {
  UserRequest,
  UserProxyResponse,
  NotFoundError,
  ServerError,
  corsHeaders,
} from "tweeter-shared";
import { UserService } from "../../service/UserService";
import { DynamoDAOFactory } from "../../data/factory/DynamoDAOFactory";

export const handler = async (
  request: UserRequest
): Promise<UserProxyResponse> => {
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
      success: true,
      message: null,
      user: targetUser,
    };
  } catch (error:any) {
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
    };
  }
};
