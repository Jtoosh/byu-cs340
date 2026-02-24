import { AuthPresenter, AuthView } from "./AuthPresenter";


export class LoginPresenter extends AuthPresenter<AuthView> {
  public constructor(view: AuthView) {
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
    return super.isLoading;
  }

  public set isLoading(value:boolean){
    super.isLoading = value;
  }
}
