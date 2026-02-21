import { AuthToken } from "tweeter-shared";
import { User } from "tweeter-shared/dist/model/domain/User";
import { UserService } from "../../model.service/UserService";
import { PagedUserItemPresenter } from "./PagedUserItemPresenter";
import { PagedPresenterView } from "../ViewInterfaces/PagedPresenterView";

export interface UserItemView extends PagedPresenterView<User> {}

export abstract class UserItemPresenter extends PagedUserItemPresenter {
  private userService: UserService;

  protected constructor(view: UserItemView) {
    super(view);
    this.userService = new UserService();
  }

  public reset() {
    this.lastItem = null;
    this.hasMoreItems = true;
  }
  public async getUser(
    authToken: AuthToken,
    alias: string,
  ): Promise<User | null> {
    return this.userService.getUser(authToken, alias);
  }

  public abstract loadMoreItems(authToken: AuthToken, userAlias: string): void;
}
