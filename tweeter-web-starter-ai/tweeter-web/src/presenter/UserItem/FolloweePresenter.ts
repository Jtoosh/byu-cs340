import { AuthToken, User } from "tweeter-shared";
import { UserItemPresenter } from "./UserItemPresenter";
import { PagedPresenterView } from "../PagedPresenter";

export class FolloweePresenter extends UserItemPresenter {
  public constructor(view: PagedPresenterView<User>) {
    super(view);
  }
  protected getItemDescription(): string {
    return "load followees";
  }
  protected async getMoreItems(
    authToken: AuthToken,
    userAlias: string,
  ): Promise<[User[], boolean]> {
    return await this.service.loadMoreFollowees(
      authToken,
      userAlias,
      this.pageSize,
      this.lastItem,
    );
  }
}
