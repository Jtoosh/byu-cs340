import { View } from "../Presenter";

export interface MessageView extends View {
  displayInfoMessage: (message: string, duration: number) => string;
  deleteMessage: (messageId: string) => void;
}
