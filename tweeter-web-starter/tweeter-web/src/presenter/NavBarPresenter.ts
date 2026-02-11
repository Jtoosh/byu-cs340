import { NavigateFunction } from "react-router-dom";

export interface navBarHooks{
  displayInfoMessage:(message: string, duration: number, bootstrapClasses?: string | undefined) => string,
  deleteMessage: (messageId: string) => void,
  clearUserInfo:() => void,
  navigate: NavigateFunction,
  displayErrorMessage : (message: string, bootstrapClasses?: string | undefined) => string
}

export class NavBarPresenter{
  private hooks

  public constructor (hooks: navBarHooks ){
    this.hooks = hooks
  }

  public async logOut() {
    const loggingOutToastId = this.hooks.displayInfoMessage("Logging Out...", 0);

    try {
      await new Promise((res) => setTimeout(res, 1000));;

      this.hooks.deleteMessage(loggingOutToastId);
      this.hooks.clearUserInfo();
      this.hooks.navigate("/login");
    } catch (error) {
      this.hooks.displayErrorMessage( 
        `Failed to log user out because of exception: ${error}`
      );
    }
  };
}