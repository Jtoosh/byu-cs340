import { AuthToken, Status, User } from "tweeter-shared";
import { UserService } from "../../model.service/UserService";
import { PagedStatusItemPresenter } from "./PagedStatusItemPresenter";
import { View } from "../ViewInterfaces/View";

export interface StatusItemView extends View {
  addItems: (newItems: Status[]) => void;
}

export abstract class StatusItemPresenter extends PagedStatusItemPresenter {
  private userService: UserService;

  protected constructor(view: StatusItemView) {
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
