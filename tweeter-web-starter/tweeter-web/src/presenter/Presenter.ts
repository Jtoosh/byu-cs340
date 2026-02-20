import { View } from "./ViewInterfaces/View";

export abstract class Presenter {
  protected view: View;

  public constructor(view: View) {
    this.view = view;
  }
}
