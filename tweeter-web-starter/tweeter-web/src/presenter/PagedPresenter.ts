import { AuthToken } from "tweeter-shared";
import { Presenter } from "./Presenter";
import { PagedPresenterView } from "./ViewInterfaces/PagedPresenterView";

// U will need to extend a service type
export abstract class PagedPresenter<T, U> extends Presenter {
  private service: U;
  private hasMoreItems: boolean;
  private lastItem: T | null;
  private pageSize: number;

  public constructor(view: PagedPresenterView<T>) {
    super(view);
    this.service = this.createService();
    this.hasMoreItems = true;
    this.lastItem = null;
    this.pageSize = 10;
  }

  protected abstract createService(): U;

  public async loadMoreItems(authToken: AuthToken, userAlias: string) {
    try {
      const [newItems, hasMore] = await this.service.loadMoreItems(
        authToken!,
        userAlias,
        this.pageSize,
        this.lastItem,
      );

      this.hasMoreItems = hasMore;
      this.lastItem =
        newItems.length > 0 ? newItems[newItems.length - 1] : null;
      this.view.addItems(newItems);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to load story items because of exception: ${error}`,
      );
    }
  }
}
