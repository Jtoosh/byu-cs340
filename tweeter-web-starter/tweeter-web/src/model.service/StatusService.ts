import { AuthToken, Status, FakeData } from "tweeter-shared";
import { Service } from "./Service";
import {ServerFacade} from "../network/ServerFacade";

export class StatusService implements Service{
    private serverFacade = new ServerFacade()

  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null,
  ): Promise<[Status[], boolean]> {
      const req = {
          token: authToken.token,
          userAlias: userAlias,
          pageSize: pageSize,
          lastItem: lastItem
      }
   return await this.serverFacade.getFeedItems(req);
  }

  public async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null,
  ): Promise<[Status[], boolean]> {
   const req = {
       token: authToken.token,
       userAlias: userAlias,
       pageSize: pageSize,
       lastItem: lastItem
   }
   return await this.serverFacade.getStoryItems(req)
  }

  public async postStatus(
    authToken: AuthToken,
    newStatus: Status,
  ): Promise<void> {
    // Pause so we can see the logging out message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server to post the status
  }
}
