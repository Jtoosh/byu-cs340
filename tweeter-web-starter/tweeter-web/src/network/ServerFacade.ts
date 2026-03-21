import {
  PagedUserItemRequest,
  PagedUserItemResponse,
  User,
  UserDto,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL = "https://w0jy08w3tf.execute-api.us-west-2.amazonaws.com/dev";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async getMoreFollowees(
    request: PagedUserItemRequest,
  ): Promise<[User[], boolean]> {
      return await this.getMoreUserItems("/getfollowees", request)
  }

  public async getMoreFollowers(request: PagedUserItemRequest): Promise<[User[], boolean]>{
     return await this.getMoreUserItems("/getfollowers", request)
  }

  public async getMoreUserItems (endpoint: string, request: PagedUserItemRequest): Promise<[User[], boolean]>{
      const response = await this.clientCommunicator.doPost<PagedUserItemRequest, PagedUserItemResponse>(request, endpoint);

      const items: User[] | null = response.success && response.items ? response.items.map((dto) => User.createDomainObject(dto) as User) : null;

      if (response.success) {
          if (items == null) {
              throw new Error(`No followees found`);
          } else {
              return [items, response.hasMore];
          }
      } else {
          console.error(response);
          throw new Error(response.message ?? "The server facade threw an error");
      }
  }
}
