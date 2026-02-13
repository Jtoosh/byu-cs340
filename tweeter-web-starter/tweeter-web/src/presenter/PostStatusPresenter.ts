import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";

export interface PostStatusView {
  displayErrorMessage: (
    message: string,
    bootstrapClasses?: string | undefined,
  ) => string;
  displayInfoMessage: (
    message: string,
    duration: number,
    bootstrapClasses?: string | undefined,
  ) => string;
  deleteMessage: (messageId: string) => void;
}

export class PostStatusPresenter {
  private service: StatusService;
  private view: PostStatusView;
  private _isLoading;
  private _post;
  public constructor(view: PostStatusView) {
    this.service = new StatusService();
    this.view = view;
    this._isLoading = false;
    this._post = "";
  }

  public async submitPost(authToken: AuthToken, currentUser: User) {
    var postingStatusToastId = "";

    try {
      this._isLoading = true;
      postingStatusToastId = this.view.displayInfoMessage(
        "Posting status...",
        0,
      );

      const status = new Status(this._post, currentUser!, Date.now());

      await this.service.postStatus(authToken!, status);

      this._post = "";
      this.view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`,
      );
    } finally {
      this.view.deleteMessage(postingStatusToastId);
      this._isLoading = false;
    }
  }

  public get isLoading() {
    return this._isLoading;
  }

  public get post() {
    return this._post;
  }

  public set post(value:string){
    this._post = value
  }
}
