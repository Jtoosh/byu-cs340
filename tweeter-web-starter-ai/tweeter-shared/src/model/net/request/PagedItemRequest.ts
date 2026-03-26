import { UserDto } from "../../dto/UserDto";
import { TweeterRequest } from "./TweeterRequest";
import {StatusDto} from "../../dto/StatusDto";

export interface PagedItemRequest<T extends UserDto | StatusDto> extends TweeterRequest {
  readonly token :string
  readonly userAlias: string,
  readonly pageSize: number,
  readonly lastItem: T | null,
}