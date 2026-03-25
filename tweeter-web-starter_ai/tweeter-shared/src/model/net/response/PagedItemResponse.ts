import { UserDto } from "../../dto/UserDto";
import { TweeterResponse } from "./TweeterResponse";
import {StatusDto} from "../../dto/StatusDto";

export interface PagedItemResponse<T extends UserDto | StatusDto> extends TweeterResponse {
  items:  T[] | null;
  hasMore: boolean;
}
