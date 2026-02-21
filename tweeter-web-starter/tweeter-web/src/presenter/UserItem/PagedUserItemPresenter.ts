import { User } from "tweeter-shared";
import { FollowService } from "../../model.service/FollowService";
import { PagedPresenter } from "../PagedPresenter";
import { PagedPresenterView } from "../ViewInterfaces/PagedPresenterView";

export abstract class PagedUserItemPresenter extends PagedPresenter<
  User,
  FollowService
> {
  public constructor(view: PagedPresenterView<User>) {
    super(view);
  }

  protected createService(): FollowService {
    return new FollowService();
  }
}
