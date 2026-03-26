import {PostStatusRequest, TweeterResponse} from "tweeter-shared";
import {StatusService} from "../service/StatusService";

export const handler = async(request: PostStatusRequest): Promise<TweeterResponse> => {
    const statusService = new StatusService()

    await statusService.postStatus(request.token, request.status)

    return {
        success: true,
        message: null
    }
}