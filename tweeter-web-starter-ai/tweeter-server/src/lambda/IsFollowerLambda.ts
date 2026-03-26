import {FollowerStatusRequest, FollowerStatusResponse} from "tweeter-shared";
import {FollowService} from "../service/FollowService";

export const handler = async (request: FollowerStatusRequest): Promise<FollowerStatusResponse> => {
    const followService = new FollowService();

    const isFollower = await followService.getIsFollowerStatus(request.token, request.user, request.targetUser)

    return {
        success: true,
        message: null,
        isFollower: isFollower
    }
}