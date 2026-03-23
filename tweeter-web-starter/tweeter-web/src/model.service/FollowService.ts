import { AuthToken, User, FakeData } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class FollowService implements Service {
  private serverFacade = new ServerFacade();

  public async follow(
    authToken: AuthToken,
    userToFollow: User,
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the follow message. Remove when connected to the server
      const req = {
          token: authToken.token,
          userToFollow: userToFollow.dto
      }
    return await this.serverFacade.follow(req)
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User,
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    return new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server
  }
  public async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null,
  ): Promise<[User[], boolean]> {
    const req = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem,
    };
    return await this.serverFacade.getMoreFollowees(req);
  }

  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null,
  ): Promise<[User[], boolean]> {
      const req = {
          token: authToken.token,
          userAlias: userAlias,
          pageSize: pageSize,
          lastItem: lastItem,
      };
      return await this.serverFacade.getMoreFollowers(req);
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
