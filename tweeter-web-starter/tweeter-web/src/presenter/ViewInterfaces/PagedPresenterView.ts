import { View } from "./View";

export interface PagedPresenterView<T> extends View{
  addItems: (items: T[]) => void;
}