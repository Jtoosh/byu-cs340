import { AuthToken, User } from "tweeter-shared";
import { UserItemPresenter } from "./UserItemPresenter";
import { PagedPresenterView } from "../PagedPresenter";

export class FollowerPresenter extends UserItemPresenter {
  public constructor(view: PagedPresenterView<User>) {
    super(view);
  }

  protected getItemDescription(): string {
    return "load followers";
  }
  protected async getMoreItems(
    authToken: AuthToken,
    user: User,
  ): Promise<[User[], boolean]> {
    return await this.service.loadMoreFollowers(
      authToken,
      user.alias,
      this.pageSize,
      this.lastItem,
    );
  }
}
