import {AuthToken, LogoutRequest, TweeterResponse, User} from "tweeter-shared";
import {UserService} from "../service/UserService";

export const handler = async(request: LogoutRequest): Promise<TweeterResponse> => {
    const userService = new UserService();

    await userService.logOut(AuthToken.createDomainObject(request.authToken))

    return {
        success: true,
        message: null
    }
}