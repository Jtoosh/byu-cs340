import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../../model.service/UserService";

export class useUserNavigationPresenter {
  private service: UserService;

  public constructor() {
    this.service = new UserService();
  }

  public async getUser(
    authToken: AuthToken,
    alias: string,
  ): Promise<User | null>{
    return this.service.getUser(authToken, alias);
  }
}
