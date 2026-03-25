import {AuthToken, LogoutRequest, User} from "tweeter-shared";
import {UserService} from "../service/UserService";

export const handler = async(request: LogoutRequest): Promise<void> => {
    const userService = new UserService();

    await userService.logOut(AuthToken.createDomainObject(request.authToken))
}