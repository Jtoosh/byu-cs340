import {
    PagedItemRequest,
    PagedItemResponse,
    User,
    UserDto,
    Status, StatusDto
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL = "https://oirxdmmxqg.execute-api.us-west-2.amazonaws.com/dev";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  private userFactory = (dto : UserDto) => User.createDomainObject(dto)!;
  private statusFactory = (dto: StatusDto) => Status.createDomainObject(dto)!

  public async getMoreFollowees(
    request: PagedItemRequest<UserDto>,
  ): Promise<[User[], boolean]> {
      return await this.getMoreItems<UserDto, User>("/getfollowees", request, this.userFactory);
  }

  public async getMoreFollowers(request: PagedItemRequest<UserDto>): Promise<[User[], boolean]>{
     return await this.getMoreItems<UserDto, User>("/getfollowers", request, this.userFactory);
  }

  public async getFeedItems(request: PagedItemRequest<StatusDto>): Promise<[Status[], boolean]>{
     return await this.getMoreItems<StatusDto, Status>("/getfeeditems", request, this.statusFactory);
  }

  public async getStoryItems(request: PagedItemRequest<StatusDto>): Promise<[Status[], boolean]>{
      return await this.getMoreItems<StatusDto, Status>("/getstoryitems", request, this.statusFactory)
  }

  private async getMoreItems<TDto extends UserDto | StatusDto, TDomain>(endpoint: string, request: PagedItemRequest<TDto>, createFn: (dto: TDto) => TDomain): Promise<[TDomain[], boolean]>{
      const response = await this.clientCommunicator.doPost<PagedItemRequest<TDto>, PagedItemResponse<TDto>>(request, endpoint);

      const items: TDomain[] | null = response.success && response.items ? response.items.map(createFn) : null;

      if (response.success) {
          if (items == null) {
              throw new Error(`No items found`);
          } else {
              return [items, response.hasMore];
          }
      } else {
          console.error(response);
          throw new Error(response.message ?? "The server facade threw an error");
      }
  }
}