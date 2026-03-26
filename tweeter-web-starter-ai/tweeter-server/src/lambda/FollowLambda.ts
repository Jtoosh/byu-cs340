import {FollowActionRequest, FollowActionResponse} from "tweeter-shared";
import {FollowService} from "../service/FollowService";

export const handler = async (request: FollowActionRequest): Promise<FollowActionResponse>=>{
    const followService = new FollowService();

    const [followerCount, followeeCount] = request.actionType === "Follow" ? await followService.follow(request.token, request.targetUser) : await followService.unfollow(request.token, request.targetUser)

    return{
        success: true,
        message: null,
        targetUserFollowerCount: followerCount,
        targetUserFolloweeCount: followeeCount
    }
}