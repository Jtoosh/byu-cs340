import { AuthToken, Status, User } from "tweeter-shared";
import { StatusItemPresenter } from "./StatusItemPresenter";
import { PagedPresenterView } from "../PagedPresenter";

export class StoryPresenter extends StatusItemPresenter {
  public constructor(view: PagedPresenterView<Status>) {
    super(view);
  }

  protected getItemDescription(): string {
    return "load story items";
  }
  protected async getMoreItems(
    authToken: AuthToken,
    userAlias: string,
  ): Promise<[Status[], boolean]> {
    return await this.service.loadMoreStoryItems(
      authToken,
      userAlias,
      this.pageSize,
      this.lastItem,
    );
  }
}
