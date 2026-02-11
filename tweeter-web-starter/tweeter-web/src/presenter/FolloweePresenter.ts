import { AuthToken, User, FakeData } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { UserService } from "../model.service/UserService";

export const PAGE_SIZE = 10;

export interface FolloweeView {

}

export class FolloweePresenter{
  private service:FollowService;
  private userService:UserService
  private view:FolloweeView;

  public constructor(view:FolloweeView){
    this.service = new FollowService();
    this.userService = new UserService()
    this.view = view;
  }

  public async getUser (
      authToken: AuthToken,
      alias: string,
    ): Promise<User | null> {
      return this.userService.getUser(authToken, alias)
    };

    public async loadMoreItems  (lastItem: User | null){
    try {
      const [newItems, hasMore] = await props.loadMoreFunction(
        authToken!,
        displayedUser!.alias,
        PAGE_SIZE,
        lastItem,
      );

      setHasMoreItems(() => hasMore);
      setLastItem(() => newItems[newItems.length - 1]);
      addItems(newItems);
    } catch (error) {
      displayErrorMessage(
        `Failed to load ${props.itemDescription} because of exception: ${error}`,
      );
    }
  };
}