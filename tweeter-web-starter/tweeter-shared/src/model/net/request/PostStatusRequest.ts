import {TweeterRequest} from "./TweeterRequest";
import {StatusDto} from "../../dto/StatusDto";

export interface PostStatusRequest extends TweeterRequest{
    token: string,
    status: StatusDto
}