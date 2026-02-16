import { NavigateFunction } from "react-router-dom";
import { UserService } from "../model.service/UserService";

export interface navBarView {
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

export class NavBarPresenter {
  private service: UserService;
  private view;

  public constructor(hooks: navBarView) {
    this.service = new UserService();
    this.view = hooks;
  }

  public async logOut() {
    const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0);

    try {
      this.service.logOut();

      this.view.deleteMessage(loggingOutToastId);
      this.view.clearUserInfo();
      this.view.navigate("/login");
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user out because of exception: ${error}`,
      );
    }
  }
}
