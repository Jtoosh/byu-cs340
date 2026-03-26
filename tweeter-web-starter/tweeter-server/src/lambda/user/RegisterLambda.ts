import {AuthResponse, RegisterRequestDto} from "tweeter-shared";
import {UserService} from "../../service/UserService";

export const handler = async(request: RegisterRequestDto): Promise<AuthResponse> => {
    const userService = new UserService()

    const [userDto, authDto] = await userService.register(request.firstName, request.lastName, request.alias, request.password, request.userImageBase64, request.imageFileExtension);

    return{
        success: true,
        message: null,
        user: userDto,
        authToken: authDto
    }
}