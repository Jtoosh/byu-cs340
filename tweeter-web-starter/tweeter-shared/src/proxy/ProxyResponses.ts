import { APIGatewayProxyResult } from "aws-lambda";
import { UserDto } from "../model/dto/UserDto";
import { AuthTokenDto } from "../model/dto/AuthTokenDto";
import { StatusDto } from "../model/dto/StatusDto";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
  "Access-Control-Allow-Methods": "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
};

export interface TweeterProxyResponse extends APIGatewayProxyResult {
  success: boolean;
  message: string | null;
}

export interface AuthProxyResponse extends TweeterProxyResponse {
  user: UserDto| null;
  authToken: AuthTokenDto | null;
}

export interface UserProxyResponse extends TweeterProxyResponse {
  user: UserDto | null;
}

export interface FollowActionProxyResponse extends TweeterProxyResponse {
  targetUserFollowerCount: number;
  targetUserFolloweeCount: number;
}

export interface FollowerStatusProxyResponse extends TweeterProxyResponse {
  isFollower: boolean;
}

export interface FollowCountProxyResponse extends TweeterProxyResponse {
  count: number;
}

export interface PagedItemProxyResponse<T extends UserDto | StatusDto>
  extends TweeterProxyResponse {
  items: T[] | null;
  hasMore: boolean;
}
