import {FollowCountRequest, FollowCountResponse} from "tweeter-shared";
import {FollowService} from "../service/FollowService";

export const handler = async (request: FollowCountRequest): Promise<FollowCountResponse> => {
    const followService = new FollowService();

    const count = await followService.getFollowerCount(request.token, request.targetUser)

    return {
        success:true,
        message: null,
        count: count
    }
}