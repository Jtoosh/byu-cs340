import { UserDto } from "tweeter-shared";
import { Service } from "./Service";
import { DAOFactory } from "../data/factory/DAOFactory";
import { FollowsDAO } from "../data/interfaces/FollowsDAO";
import { UserDAO } from "../data/interfaces/UserDAO";

export class FollowService implements Service {
  private daoFactory: DAOFactory;
  private followsDAO: FollowsDAO;
  private userDAO: UserDAO;

  public constructor(daoFactory: DAOFactory) {
    this.daoFactory = daoFactory;
    this.followsDAO = this.daoFactory.createFollowsDAO();
    this.userDAO = this.daoFactory.createUserDAO();
  }

  public async follow(token: string, userToFollow: UserDto, sourceUser: UserDto): Promise<[followerCount: number, followeeCount: number]> {
    await this.followsDAO.follow(userToFollow.alias, sourceUser.alias, token);

    await this.userDAO.incrementFollowers(userToFollow.alias);

    await this.userDAO.incrementFollowees(sourceUser.alias);

    return await this.getCounts(userToFollow);
  }

  public async unfollow(
    token: string,
    userToUnfollow: UserDto,
    sourceUser: UserDto,
  ): Promise<[followerCount: number, followeeCount: number]> {
    await this.followsDAO.unfollow(userToUnfollow.alias, sourceUser.alias, token);

    await this.userDAO.decrementFollowers(userToUnfollow.alias);

    await this.userDAO.decrementFollowees(sourceUser.alias);

    return await this.getCounts(userToUnfollow);
  }

  public async loadMoreFollowees(userAlias: string, pageSize: number, lastItem: UserDto | null): Promise<[UserDto[], boolean]> {
    return await this.loadMoreUserItems(userAlias, pageSize, lastItem, (...args) => this.followsDAO.getFollowees(...args));
  }

  public async loadMoreFollowers(userAlias: string, pageSize: number, lastItem: UserDto | null): Promise<[UserDto[], boolean]> {
    return await this.loadMoreUserItems(userAlias, pageSize, lastItem, (...args) => this.followsDAO.getFollowers(...args));
  }

  public async getIsFollowerStatus(token: string, user: UserDto, targetUser: UserDto): Promise<boolean> {
    const followers = await this.followsDAO.getFollowers(user.alias, 10000, null);
    for (let followerAlias of followers[0]) {
      if (followerAlias === targetUser.alias) {
        return true;
      } else {
        continue;
      }
    }
    return false;
  }

  public async getFollowerCount(token: string, targetUser: UserDto): Promise<number> {
    const [followerCount, _] = await this.getCounts(targetUser);
    return followerCount;
  }

  public async getFolloweeCount(token: string, targetUser: UserDto): Promise<number> {
    const [_, followeeCount] = await this.getCounts(targetUser);
    return followeeCount;
  }

  private async loadMoreUserItems(
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null,
    getUserFunction: (alias: string, pageSize: number, lastItem: string | null) => Promise<[string[], boolean]>,
  ): Promise<[UserDto[], boolean]> {
    const userItemPage = [];
    const [userAliases, hasMore] = await getUserFunction(userAlias, pageSize, lastItem?.alias ?? null);
    for (let alias of userAliases) {
      const userDSO = await this.userDAO.getUser(alias);
      let userDTO = {
        firstName: userDSO.firstName,
        lastName: userDSO.lastName,
        alias: userDSO.alias,
        imageUrl: userDSO.imageUrl,
      };
      userItemPage.push(userDTO);
    }
    return [userItemPage, hasMore];
  }

  private async getCounts(targetUser: UserDto): Promise<[number, number]> {
    const dso = await this.userDAO.getUser(targetUser.alias);
    return [dso.followerCount, dso.followeeCount];
  }
}
