import {TweeterResponse} from "./TweeterResponse";

export interface FollowerStatusResponse extends TweeterResponse{
    isFollower: boolean
}