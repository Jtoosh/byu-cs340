import { PostStatusRequest, TweeterProxyResponse, UnauthorizedError, ServerError, corsHeaders } from "tweeter-shared";
import { StatusService } from "../../service/StatusService";
import { DynamoDAOFactory } from "../../data/factory/DynamoDAOFactory";
import { AuthenticationService } from "../../service/AuthenticationService";
import { MessageService } from "../../service/MessageService";

export const handler = async (request: PostStatusRequest): Promise<TweeterProxyResponse> => {
  const statusService = new StatusService(new DynamoDAOFactory());
  const authService = new AuthenticationService(new DynamoDAOFactory());
  const messageService = new MessageService("","https://sqs.us-west-2.amazonaws.com/615299777283/Post-Status-Queue" );

  try {
    await authService.authenticateToken(request.token, request.status.user.alias);

    const statusDSO = await statusService.postStatus(request.token, request.status);
    await messageService.sendMessage(statusDSO);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        message: null,
      }),
      success: true,
      message: null,
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
        success: false,
        message: error.message,
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
    };
  }
};
