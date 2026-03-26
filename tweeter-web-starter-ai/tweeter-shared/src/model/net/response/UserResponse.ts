import {TweeterResponse} from "./TweeterResponse";
import {UserDto} from "../../dto/UserDto";

export interface UserResponse extends TweeterResponse{
    user: UserDto | null
}