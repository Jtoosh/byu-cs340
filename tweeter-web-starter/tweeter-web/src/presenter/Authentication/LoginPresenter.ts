import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../../model.service/UserService";
import { NavigateFunction } from "react-router-dom";
import { Presenter } from "../Presenter";

export interface LoginView {
  navigate: NavigateFunction;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean,
  ) => void;
  displayErrorMessage: (message: string) => void;
}

export class LoginPresenter extends Presenter<LoginView> {
  private service: UserService;

  private _isLoading: boolean;

  public constructor(view: LoginView) {
    super(view);
    this.service = new UserService();

    this._isLoading = false;
  }

  public async doLogin(
    alias: string,
    password: string,
    rememberMe: boolean,
    originalUrl: string | undefined,
  ) {
    await this.doFailureReportingOperation(async () => {
      this._isLoading = true;

      const [user, authToken] = await this.service.login(alias, password);

      this.view.updateUserInfo(user, user, authToken, rememberMe);

      if (!!originalUrl) {
        this.view.navigate(originalUrl);
      } else {
        this.view.navigate(`/feed/${user.alias}`);
      }
    }, "log user in");

    this._isLoading = false;
  }

  public get isLoading() {
    return this._isLoading;
  }
}
