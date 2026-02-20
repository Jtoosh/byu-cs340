import { View } from "./View";

export interface MessageView extends View {
  displayInfoMessage: (message: string, duration: number) => void;
  clearLastInfoMessage: () => void;
}
