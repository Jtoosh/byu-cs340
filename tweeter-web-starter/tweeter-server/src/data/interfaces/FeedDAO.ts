import { AuthTokenDto, StatusDto } from "tweeter-shared";
import { StatusDso } from "./dso/StatusDso";

export interface FeedDAO {
  getFeedPage(userAlias: string, token: string, pageSize: number, lastItem: StatusDto|null): Promise<[StatusDso[], boolean]>;
  updateFeed(newStatus: StatusDso, followeeAliases: string[]): Promise<void>;
}
