import {TweeterRequest} from "./TweeterRequest";

export interface UserRequest extends TweeterRequest {
    token: string,
    targetUserAlias: string
}