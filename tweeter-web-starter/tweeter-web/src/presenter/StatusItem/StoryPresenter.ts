import { AuthToken } from "tweeter-shared";
import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";



export class StoryPresenter extends StatusItemPresenter {
  public constructor(view: StatusItemView) {
    super(view);
  }

  public async loadMoreItems(authToken: AuthToken, userAlias: string) {
    await this.doFailureReportingOperation(async () => {
      const [newItems, hasMore] = await this.service.loadMoreStoryItems(
        authToken!,
        userAlias,
        this.pageSize,
        this.lastItem,
      );

      this.hasMoreItems = hasMore;
      this.lastItem =
        newItems.length > 0 ? newItems[newItems.length - 1] : null;
      this.view.addItems(newItems);
    }, "load story items");
  }
}
