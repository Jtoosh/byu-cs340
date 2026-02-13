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
  deleteMessage: (messageId: string) => void,
  setPost: React.Dispatch<React.SetStateAction<string>>
}

export class PostStatusPresenter {
  private service: StatusService;
  private view: PostStatusView;
  private _isLoading;
  public constructor(view: PostStatusView) {
    this.service = new StatusService();
    this.view = view;
    this._isLoading = false;

  }

  public async submitPost(post:string, authToken: AuthToken, currentUser: User) {
    var postingStatusToastId = "";

    try {
      this._isLoading = true;
      postingStatusToastId = this.view.displayInfoMessage(
        "Posting status...",
        0,
      );

      const status = new Status(post, currentUser!, Date.now());

      await this.service.postStatus(authToken!, status);

      this.view.setPost("");
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
}
