import {AuthTokenDto, UserDto} from "tweeter-shared";

export interface FollowsDAO{
    getFollowees(userAlias:string,  pageSize: number, lastItem: string | null): Promise<[string[], boolean]> //Potentially add pageSize and lastItem argument?
    getFollowers(userAlias:string,  pageSize: number, lastItem: string | null): Promise<[string[], boolean]>
    follow(targetUserAlias:string, sourceUserAlias: string, token: string): Promise<void> //returns FollowerCount and FolloweeCount
    unfollow(targetUserAlias:string,  sourceUserAlias: string, token: string): Promise<void>, //returns FollowerCount and FolloweeCount
}
