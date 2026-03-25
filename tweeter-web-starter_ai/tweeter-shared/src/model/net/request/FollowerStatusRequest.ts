import {UserDto} from "../../dto/UserDto";
import {TweeterRequest} from "./TweeterRequest";

export interface FollowerStatusRequest extends TweeterRequest{
    token: string,
    user: UserDto,
    targetUser: UserDto
}