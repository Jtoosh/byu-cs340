import {FollowService} from "../service/FollowService";
import {PagedUserItemRequest, PagedUserItemResponse} from "tweeter-shared";

export const handler = async (request: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
    const followService = new FollowService();

    const [items, hasMore] = await followService.loadMoreFollowers(request.token, request.userAlias, request.pageSize, request.lastItem)
    return{
        success: true,
        message: null,
        items: items,
        hasMore: hasMore
    }
}