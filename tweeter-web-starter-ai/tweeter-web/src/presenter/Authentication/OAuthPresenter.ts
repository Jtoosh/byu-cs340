export interface OAuthView {
  displayInfoMessage: (
    message: string,
    duration: number,
    bootstrapClasses?: string | undefined,
  ) => string;
}

export class OAuthPresenter {
  private view: OAuthView;

  public constructor(view: OAuthView) {
    this.view = view;
  }

  public displayInfoMessageWithDarkBackground (message: string): void{
    this.view.displayInfoMessage(
      message,
      3000,
      "text-white bg-primary",
    );
  };
}
