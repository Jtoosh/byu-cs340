import { NavigateFunction } from "react-router-dom";
import { UserService } from "../model.service/UserService";
import { Presenter } from "./Presenter";
import { MessageView } from "./ViewInterfaces/MessageView";

export interface AppNavbarView extends MessageView{
  clearUserInfo: () => void;
  navigate: NavigateFunction;
}

export class AppNavbarPresenter extends Presenter<AppNavbarView> {
  private service: UserService;

  public constructor(view: AppNavbarView) {
    super(view);
    this.service = new UserService();
  }

  public async logOut() {
    const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0);

    await this.doFailureReportingOperation(async () => {
      await this.service.logOut();

      this.view.deleteMessage(loggingOutToastId);
      this.view.clearUserInfo();
      this.view.navigate("/login");
    }, "log user out");
  }
}
