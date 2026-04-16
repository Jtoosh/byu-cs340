import { AuthProxyResponse, RegisterRequestDto, BadRequestError, ServerError, corsHeaders } from "tweeter-shared";
import { UserService } from "../../service/UserService";
import { DynamoDAOFactory } from "../../data/factory/DynamoDAOFactory";
import { AlreadyInUseError } from "tweeter-shared";

interface ApiGatewayResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

export const handler = async (event: any): Promise<ApiGatewayResponse> => {
  console.log("RegisterLambda: Request received");

  let request: RegisterRequestDto;
  try {
    request = JSON.parse(event.body);
  } catch (error) {
    console.error("RegisterLambda: Failed to parse request body:", error);
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        message: "Invalid request body",
      }),
    };
  }

  console.log("RegisterLambda: Parsed request:", JSON.stringify(request));

  const userService = new UserService(new DynamoDAOFactory());

  try {
    console.log("RegisterLambda: Attempting registration for alias:", request.alias);

    const [userDto, authDto] = await userService.register(
      request.firstName,
      request.lastName,
      request.alias,
      request.password,
      request.userImageBase64,
      request.imageFileExtension,
    );

    console.log("RegisterLambda: Registration successful for:", userDto.alias);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        user: userDto,
        authToken: authDto,
        message: null,
      }),
    };
  } catch (error: any) {
    console.error("RegisterLambda: Error during registration:", error);
    console.error("RegisterLambda: Error name:", error?.constructor?.name);
    console.error("RegisterLambda: Error message:", error?.message);

    if (error instanceof BadRequestError) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          message: error.message,
        }),
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
