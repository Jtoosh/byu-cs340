import { AuthToken } from "tweeter-shared";
import { UserItemPresenter, UserItemView } from "./UserItemPresenter";
import { FollowService } from "../../model.service/FollowService";

export const PAGE_SIZE = 10;

export class FollowerPresenter extends UserItemPresenter {
  public constructor(view: UserItemView) {
    super(view);
  }

  public async loadMoreItems(authToken: AuthToken, userAlias: string) {
    await this.doFailureReportingOperation(async () => {
      const [newItems, hasMore] = await this.service.loadMoreFollowers(
        authToken!,
        userAlias,
        PAGE_SIZE,
        this.lastItem,
      );

      this.hasMoreItems = hasMore;
      this.lastItem =
        newItems.length > 0 ? newItems[newItems.length - 1] : null;
      this.view.addItems(newItems);
    }, "load followers");
  }
}
