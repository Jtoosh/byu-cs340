import { AuthProxyResponse, RegisterRequestDto, BadRequestError, ServerError, corsHeaders } from "tweeter-shared";
import { UserService } from "../../service/UserService";
import { DynamoDAOFactory } from "../../data/factory/DynamoDAOFactory";
import { AlreadyInUseError } from "tweeter-shared";

export const handler = async (request: RegisterRequestDto): Promise<AuthProxyResponse> => {
  const userService = new UserService(new DynamoDAOFactory());

  try {
    const [userDto, authDto] = await userService.register(
      request.firstName,
      request.lastName,
      request.alias,
      request.password,
      request.userImageBase64,
      request.imageFileExtension,
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
  } catch (error: any) {
    if (error instanceof BadRequestError) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          message: error.message,
        }),
        success: false,
        message: error.message,
        user: null,
        authToken: null,
      };
    }
    if (error instanceof AlreadyInUseError) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          message: error.message,
        }),
        success: false,
        message: error.message,
        user: null,
        authToken: null,
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
        authToken: null,
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
      authToken: null,
    };
  }
};
