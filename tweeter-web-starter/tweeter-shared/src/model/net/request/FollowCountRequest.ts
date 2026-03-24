import {TweeterRequest} from "./TweeterRequest";
import {UserDto} from "../../dto/UserDto";

export interface FollowCountRequest extends TweeterRequest{
    token: string,
    targetUser: UserDto
}