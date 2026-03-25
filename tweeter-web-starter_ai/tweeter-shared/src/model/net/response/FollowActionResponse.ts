import {TweeterResponse} from "./TweeterResponse";

export interface FollowActionResponse extends TweeterResponse {
    targetUserFollowerCount: number;
    targetUserFolloweeCount: number;
}