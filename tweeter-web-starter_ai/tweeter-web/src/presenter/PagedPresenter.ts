import { AuthToken, Status, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
import { UserService } from "../model.service/UserService";
import { Service } from "../model.service/Service";

export interface PagedPresenterView<T> extends View {
  addItems: (items: T[]) => void;
}

// U will need to extend a service type
export abstract class PagedPresenter<T extends User | Status, U extends Service> extends Presenter<
  PagedPresenterView<T>
> {
  private _service: U;
  private _hasMoreItems: boolean;
  private _lastItem: T | null;
  private _pageSize: number;
  private userService: UserService;

  protected constructor(view: PagedPresenterView<T>) {
    super(view);
    this._service = this.createService();
    this.userService = new UserService();
    this._hasMoreItems = true;
    this._lastItem = null;
    this._pageSize = 10;
  }

  protected abstract createService(): U;

  protected abstract getItemDescription(): string;

  protected abstract getMoreItems(authToken: AuthToken, userAlias: string) : Promise<[T[], boolean]>

  protected get lastItem() {
    return this._lastItem;
  }

  protected set lastItem(item: T | null) {
    this._lastItem = item;
  }

  public get hasMoreItems() {
    return this._hasMoreItems;
  }

  protected set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }

  protected get service() {
    return this._service;
  }
  protected get pageSize() {
    return this._pageSize;
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

  public async loadMoreItems(authToken: AuthToken, userAlias: string) {
    this.doFailureReportingOperation(async () => {
      const [newItems, hasMore] = await this.getMoreItems(authToken, userAlias);
      this._hasMoreItems = hasMore;
      this._lastItem =
        newItems.length > 0 ? newItems[newItems.length - 1] : null;
      this.view.addItems(newItems);
    }, this.getItemDescription());
  }
}
