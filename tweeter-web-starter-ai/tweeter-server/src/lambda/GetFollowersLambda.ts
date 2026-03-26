import {FollowService} from "../service/FollowService";
import {PagedItemRequest, PagedItemResponse, UserDto} from 'tweeter-shared';

export const handler = async (request: PagedItemRequest<UserDto>): Promise<PagedItemResponse<UserDto>> => {
    const followService = new FollowService();

    const [items, hasMore] = await followService.loadMoreFollowers(request.token, request.userAlias, request.pageSize, request.lastItem)
    return {
        success: true,
        message: null,
        items: items,
        hasMore: hasMore
    }
}