import { AuthToken } from "tweeter-shared";
import { User } from "tweeter-shared/dist/model/domain/User";
import { UserService } from "../../model.service/UserService";
import { PagedUserItemPresenter } from "./PagedUserItemPresenter";

export interface UserItemView {
  addItems: (newItems: User[]) => void;
  displayErrorMessage: (message: string) => void;
}

export abstract class UserItemPresenter extends PagedUserItemPresenter{
  private userService: UserService;

  //Transferred state variables
  // private _hasMoreItems = true;
  // private _lastItem: User | null = null;

  protected constructor(view: UserItemView) {
    super(view)
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
