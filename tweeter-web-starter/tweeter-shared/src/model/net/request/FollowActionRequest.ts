import {UserDto} from "../../dto/UserDto";
import {ActionType} from "../../domain/ActionType";

export interface FollowActionRequest {
    readonly token: string
    readonly actionType: ActionType
    readonly targetUser: UserDto
}