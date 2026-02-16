import { AuthToken, User, FakeData } from "tweeter-shared";

export class FollowService {
  public async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null,
  ): Promise<[User[], boolean]> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
  }

  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null,
  ): Promise<[User[], boolean]> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
  }


  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User,
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

  // To be implemented later
  // public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
  //   try {
  //     setFollowerCount(await getFollowerCount(authToken, displayedUser));
  //   } catch (error) {
  //     displayErrorMessage(
  //       `Failed to get followers count because of exception: ${error}`,
  //     );
  //   }
  // }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User,
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFolloweeCount(user.alias);
  }

  // To be implemented in later milestone
  // public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
  //   try {
  //     setFolloweeCount(await getFolloweeCount(authToken, displayedUser));
  //   } catch (error) {
  //     displayErrorMessage(
  //       `Failed to get followees count because of exception: ${error}`,
  //     );
  //   }
  // }
}
