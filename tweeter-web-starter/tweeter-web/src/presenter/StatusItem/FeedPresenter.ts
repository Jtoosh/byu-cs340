import { AuthToken, Status, User } from "tweeter-shared";
import { PagedStatusItemPresenter } from "./PagedStatusItemPresenter";
import { PagedPresenterView } from "../PagedPresenter";

export class FeedPresenter extends PagedStatusItemPresenter {
  public constructor(view: PagedPresenterView<Status>) {
    super(view);
  }

  protected getItemDescription(): string {
    return "load feed items";
  }
  protected async getMoreItems(
    authToken: AuthToken,
    user: User,
  ): Promise<[Status[], boolean]> {
    return await this.service.loadMoreFeedItems(
      authToken,
      user.alias,
      this.pageSize,
      this.lastItem,
    );
  }
}
