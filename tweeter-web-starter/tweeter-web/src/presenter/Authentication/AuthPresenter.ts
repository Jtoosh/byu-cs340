import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../../model.service/UserService";
import { Presenter, View } from "../Presenter";
import { LoginView } from "./LoginPresenter";
import { RegisterView } from "./RegisterPresenter";

export abstract class AuthPresenter<
  T extends LoginView | RegisterView,
> extends Presenter<T> {
  private _service: UserService;

  private _isLoading: boolean;

  protected constructor(view: T) {
    super(view);
    this._service = new UserService();
    this._isLoading = false;
  }

  protected get service() {
    return this._service;
  }

  protected get isLoading() {
    return this._isLoading;
  }

  protected set isLoading(value: boolean) {
    this._isLoading = value;
  }

  protected async doAuth(
    authCall: () => Promise<[User, AuthToken]>,
    rememberMe: boolean,
    originalUrl?: string,
  ) {
    this._isLoading = true;

    const [user, authToken] = await authCall();

    this.view.updateUserInfo(user, user, authToken, rememberMe);
    if (!!originalUrl) {
      this.view.navigate(originalUrl);
    } else {
      this.view.navigate(`/feed/${user.alias}`);
    }
     this.isLoading = false;
  }
}
