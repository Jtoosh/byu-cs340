import {TweeterRequest} from "./TweeterRequest";

export interface AuthRequest extends TweeterRequest {
    alias: string,
    password: string
}