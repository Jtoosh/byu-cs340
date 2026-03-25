import { Status } from "tweeter-shared";
import { StatusService } from "../../model.service/StatusService";
import { PagedPresenter } from "../PagedPresenter";
import { PagedPresenterView } from "../PagedPresenter";

export abstract class StatusItemPresenter extends PagedPresenter<
  Status,
  StatusService
> {
  public constructor(view: PagedPresenterView<Status>) {
    super(view);
  }

  protected createService(): StatusService {
    return new StatusService();
  }
}
