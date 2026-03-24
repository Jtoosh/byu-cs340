import { AuthToken, User, FakeData, UserDto } from "tweeter-shared";
import { Service } from "./Service";

export class FollowService implements Service {
  public async follow(
    token: string,
    userToFollow: UserDto,
  ): Promise<[followerCount: number, followeeCount: number]> {
    return [await FakeData.instance.getFollowerCount(userToFollow.alias), await FakeData.instance.getFolloweeCount(userToFollow.alias)]
  }

  public async unfollow(
    token: string,
    userToUnfollow: UserDto,
  ): Promise<[followerCount: number, followeeCount: number]> {
      return [await FakeData.instance.getFollowerCount(userToUnfollow.alias), await FakeData.instance.getFolloweeCount(userToUnfollow.alias)]
  }
  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null,
  ): Promise<[UserDto[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.getFakeData(lastItem, pageSize, userAlias);
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null,
  ): Promise<[UserDto[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.getFakeData(lastItem, pageSize, userAlias);
  }

  public async getIsFollowerStatus(
    token: string,
    user: UserDto,
    targetUser: UserDto,
  ): Promise<boolean> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.isFollower();
  }

  public async getFollowerCount(
    authToken: AuthToken,
    user: User,
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFollowerCount(user.alias);
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User,
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFolloweeCount(user.alias);
  }

  private async getFakeData(
    lastItem: UserDto | null,
    pageSize: number,
    userAlias: string,
  ): Promise<[UserDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfUsers(
      User.createDomainObject(lastItem),
      pageSize,
      userAlias,
    );
    const dtos = items.map((user: User) => user.dto);
    return [dtos, hasMore];
  }
}
