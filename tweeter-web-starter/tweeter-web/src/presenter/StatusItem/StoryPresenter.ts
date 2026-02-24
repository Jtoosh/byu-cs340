import { AuthToken, Status, User } from "tweeter-shared";
import { PagedStatusItemPresenter } from "./PagedStatusItemPresenter";
import { PagedPresenterView } from "../PagedPresenter";

export class StoryPresenter extends PagedStatusItemPresenter {
  public constructor(view: PagedPresenterView<Status>) {
    super(view);
  }

  protected getItemDescription(): string {
    return "load story items";
  }
  protected async getMoreItems(
    authToken: AuthToken,
    user: User,
  ): Promise<[Status[], boolean]> {
    return await this.service.loadMoreStoryItems(
      authToken,
      user.alias,
      this.pageSize,
      this.lastItem,
    );
  }
}
