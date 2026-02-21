import { NavigateFunction } from "react-router-dom";
import { UserService } from "../model.service/UserService";
import { Presenter } from "./Presenter";

export interface NavBarView {
  displayInfoMessage: (
    message: string,
    duration: number,
    bootstrapClasses?: string | undefined,
  ) => string;
  deleteMessage: (messageId: string) => void;
  clearUserInfo: () => void;
  navigate: NavigateFunction;
  displayErrorMessage: (
    message: string,
    bootstrapClasses?: string | undefined,
  ) => string;
}

export class NavBarPresenter extends Presenter<NavBarView> {
  private service: UserService;

  public constructor(view: NavBarView) {
    super(view);
    this.service = new UserService();
  }

  public async logOut() {
    const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0);

    await this.doFailureReportingOperation(async () => {
      this.service.logOut();

      this.view.deleteMessage(loggingOutToastId);
      this.view.clearUserInfo();
      this.view.navigate("/login");
    }, "log user out");
  }
}
