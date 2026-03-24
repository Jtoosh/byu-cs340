import {UserDto} from "../../dto/UserDto";

export interface FollowerStatusRequest{
    token: string,
    user: UserDto,
    targetUser: UserDto
}