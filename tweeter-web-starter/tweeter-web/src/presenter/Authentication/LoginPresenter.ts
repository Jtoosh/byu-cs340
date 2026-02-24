import { User, AuthToken } from "tweeter-shared";
import { NavigateFunction } from "react-router-dom";
import { View } from "../Presenter";
import { AuthPresenter } from "./AuthPresenter";

export interface LoginView extends View {
  navigate: NavigateFunction;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean,
  ) => void;
}

export class LoginPresenter extends AuthPresenter<LoginView> {
  public constructor(view: LoginView) {
    super(view);
  }

  public async doLogin(
    alias: string,
    password: string,
    rememberMe: boolean,
    originalUrl: string | undefined,
  ) {
    await this.doFailureReportingOperation(async () => {
      await this.doAuth(
        async () => {
          return await this.service.login(alias, password);
        },
        rememberMe,
        originalUrl,
      );
    }, "log user in");
  }

  public get isLoading(): boolean {
    return this.isLoading;
  }
}
