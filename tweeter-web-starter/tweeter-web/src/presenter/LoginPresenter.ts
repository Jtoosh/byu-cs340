import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { NavigateFunction } from "react-router-dom";

export interface LoginView {
  navigate: NavigateFunction,
  updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void,
  displayErrorMessage: (message: string) => void;
}

export class LoginPresenter {
  private service: UserService;
  private view: LoginView;
  private isLoading: boolean;

  public constructor(view: LoginView) {
    this.service = new UserService();
    this.view = view;
    this.isLoading = false;
  }

  public async doLogin(alias: string, password: string, rememberMe: boolean, originalUrl:string | undefined) {
    try {
      this.isLoading = true;

      const [user, authToken] = await this.service.login(alias, password);

      this.view.updateUserInfo(user, user, authToken, rememberMe);

      if (!!originalUrl) {
        this.view.navigate(originalUrl);
      } else {
        this.view.navigate(`/feed/${user.alias}`);
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`,
      );
    } finally {
      this.isLoading = false;
    }
  }
}
