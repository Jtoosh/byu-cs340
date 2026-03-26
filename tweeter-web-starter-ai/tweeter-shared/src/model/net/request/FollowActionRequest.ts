import {UserDto} from "../../dto/UserDto";
import {ActionType} from "../../domain/ActionType";
import {TweeterRequest} from "./TweeterRequest";

export interface FollowActionRequest extends TweeterRequest {
    readonly token: string
    readonly actionType: ActionType
    readonly targetUser: UserDto
}