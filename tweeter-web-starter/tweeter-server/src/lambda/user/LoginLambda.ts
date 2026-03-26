import {AuthRequest, AuthResponse} from "tweeter-shared";
import {UserService} from "../../service/UserService";

export const handler = async(request: AuthRequest): Promise<AuthResponse> => {
    const userService = new UserService();

    const [userDto, authDto] = await userService.login(request.alias, request.password)

    return{
        success: true,
        message: null,
        user: userDto,
        authToken: authDto
    }

}