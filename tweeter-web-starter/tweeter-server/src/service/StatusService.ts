import {AuthToken, Status, FakeData, StatusDto  } from "tweeter-shared";
import { Service } from "./Service";

export class StatusService implements Service{
  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null,
  ): Promise<[StatusDto[], boolean]> {
    return  this.getFakeData(lastItem, pageSize)
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null,
  ): Promise<[StatusDto[], boolean]> {
      return this.getFakeData(lastItem, pageSize)
  }

  public async postStatus(
    token: string,
    newStatus: StatusDto,
  ): Promise<void> {
    // Pause so we can see the logging out message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server to post the status
  }

    private async getFakeData(
        lastItem: StatusDto | null,
        pageSize: number,
    ): Promise<[StatusDto[], boolean]> {
        const [items, hasMore] = FakeData.instance.getPageOfStatuses(
            Status.createDomainObject(lastItem),
            pageSize,
        );
        const dtos = items.map((status: Status) => status.dto);
        return [dtos, hasMore];
    }
}
