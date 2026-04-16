import { StatusDto } from "tweeter-shared";
import { Service } from "./Service";
import { DAOFactory } from "../data/factory/DAOFactory";
import { StatusDAO } from "../data/interfaces/StatusDAO";
import { FeedDAO } from "../data/interfaces/FeedDAO";
import { UserDAO } from "../data/interfaces/UserDAO";
import { UserDso } from "../data/interfaces/dso/UserDso";
import { FollowsDAO } from "../data/interfaces/FollowsDAO";
import { NotFoundError } from "tweeter-shared";
import { StatusDso } from "../data/interfaces/dso/StatusDso";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

export class StatusService implements Service {
  private daoFactory: DAOFactory;
  private statusDAO: StatusDAO;
  private feedDAO: FeedDAO;
  private userDAO: UserDAO;
  private sqs_url = "https://sqs.us-west-2.amazonaws.com/615299777283/Post-Status-Queue";

  public constructor(daoFactory: DAOFactory) {
    this.daoFactory = daoFactory;
    this.statusDAO = this.daoFactory.createStatusDAO();
    this.feedDAO = this.daoFactory.createFeedDAO();
    this.userDAO = this.daoFactory.createUserDAO();
  }

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null,
  ): Promise<[StatusDto[], boolean]> {
    const returnItems: StatusDto[] = [];
    const [feedDsos, hasMore] = await this.feedDAO.getFeedPage(userAlias, token, pageSize, lastItem);
    const authorUserDsos = feedDsos.map(async (status) => await this.userDAO.getUser(status.userAlias));
    for (let i = 0; i < feedDsos.length; i++) {
      returnItems.push({
        post: feedDsos[i].post,
        user: this.createUserDto(await authorUserDsos[i]),
        timestamp: feedDsos[i].timestamp,
      });
    }
    return [returnItems, hasMore];
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null,
  ): Promise<[StatusDto[], boolean]> {
    const [storyDsos, hasMore] = await this.statusDAO.getStatusesPage(userAlias, pageSize, lastItem ?? null);
    const userDso = await this.userDAO.getUser(userAlias);
    const storyPage = storyDsos.map((status) => ({
      post: status.post,
      user: this.createUserDto(userDso),
      timestamp: status.timestamp,
    }));
    return [storyPage, hasMore];
  }

  public async postStatus(token: string, newStatus: StatusDto): Promise<StatusDso> {
    await this.statusDAO.createStatus(newStatus);
    return {
      userAlias: newStatus.user.alias,
      post: newStatus.post,
      timestamp: newStatus.timestamp,
    };
  }
  
  public async updateFeed(newStatus: StatusDso, followers: string[]) {
    await this.feedDAO.updateFeed(newStatus, followers)
  }

  private createUserDto(dso: UserDso) {
    return {
      firstName: dso.firstName,
      lastName: dso.lastName,
      alias: dso.alias,
      imageUrl: dso.imageUrl,
    };
  }
}
