import { StatusDto } from "tweeter-shared";
import { StatusDso } from "./dso/StatusDso";

export interface StatusDAO{
    getStatus(userAlias:string, timestamp: number ): Promise<StatusDso>
    getStatusesPage(userAlias: string, pageSize: number, lastItem: StatusDto | null): Promise<[StatusDso[], boolean]>
    createStatus(status: StatusDto): Promise<void>
}