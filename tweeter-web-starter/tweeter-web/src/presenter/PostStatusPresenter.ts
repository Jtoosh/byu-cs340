import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { Presenter } from "./Presenter";
import { MessageView } from "./ViewInterfaces/MessageView";

export interface PostStatusView extends MessageView{
  setPost: React.Dispatch<React.SetStateAction<string>>;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private service: StatusService;

  private _isLoading;
  public constructor(view: PostStatusView) {
    super(view);
    this.service = new StatusService();

    this._isLoading = false;
  }

  public async submitPost(
    post: string,
    authToken: AuthToken,
    currentUser: User,
  ) {
    var postingStatusToastId = "";

    await this.doFailureReportingOperation(async () => {
      this._isLoading = true;
      postingStatusToastId = this.view.displayInfoMessage(
        "Posting status...",
        0,
      );

      const status = new Status(post, currentUser!, Date.now());

      await this.service.postStatus(authToken!, status);

      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    }, "post the status");
    
    this.view.deleteMessage(postingStatusToastId);
    this._isLoading = false;
  }

  public get isLoading() {
    return this._isLoading;
  }
}
