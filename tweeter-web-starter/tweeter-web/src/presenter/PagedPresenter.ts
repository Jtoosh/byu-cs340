import { AuthToken, User } from "tweeter-shared";
import { Presenter } from "./Presenter";
import { PagedPresenterView } from "./ViewInterfaces/PagedPresenterView";

// U will need to extend a service type
export abstract class PagedPresenter<T, U> extends Presenter<PagedPresenterView<T>> {
  private _service: U;
  private _hasMoreItems: boolean;
  private _lastItem: T | null;
  private pageSize: number;

  public constructor(view: PagedPresenterView<T>) {
    super(view);
    this._service = this.createService();
    this._hasMoreItems = true;
    this._lastItem = null;
    this.pageSize = 10;
  }

  protected abstract createService(): U;

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

  protected get service(){
    return this._service
  }

  public async loadMoreItems(authToken: AuthToken, userAlias: string) {
    try {
      const [newItems, hasMore] = await this._service.loadMoreItems(
        authToken!,
        userAlias,
        this.pageSize,
        this._lastItem,
      );

      this._hasMoreItems = hasMore;
      this._lastItem =
        newItems.length > 0 ? newItems[newItems.length - 1] : null;
      this.view.addItems(newItems);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to load story items because of exception: ${error}`,
      );
    }
  }
}
