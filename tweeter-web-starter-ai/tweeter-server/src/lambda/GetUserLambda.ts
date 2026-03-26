import {UserRequest, UserResponse} from "tweeter-shared";
import {UserService} from "../service/UserService";

export const handler = async (request: UserRequest): Promise<UserResponse> => {
    const userService = new UserService();

    const targetUser = await userService.getUser(request.token, request.targetUserAlias)

    return {
        success: true,
        message: null,
        user: targetUser
    }
}