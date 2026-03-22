import {
    PagedItemRequest,
    PagedItemResponse,
    User,
    UserDto,
    Status, StatusDto
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL = "https://e89lpull68.execute-api.us-west-2.amazonaws.com/dev";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async getMoreFollowees(
    request: PagedItemRequest<UserDto>,
  ): Promise<[User[], boolean]> {
      return await this.getMoreItems<UserDto, User>("/getfollowees", request, (dto) => User.createDomainObject(dto)!);
  }

  public async getMoreFollowers(request: PagedItemRequest<UserDto>): Promise<[User[], boolean]>{
     return await this.getMoreItems<UserDto, User>("/getfollowers", request, (dto) => User.createDomainObject(dto)!);
  }

  public async getFeedItems(request: PagedItemRequest<StatusDto>): Promise<[Status[], boolean]>{
     return await this.getMoreItems<StatusDto, Status>("/getfeeditems", request, (dto) => Status.createDomainObject(dto)!);
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