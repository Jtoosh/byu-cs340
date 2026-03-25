import {AuthToken, Status, FakeData} from "tweeter-shared";
import {Service} from "./Service";
import {ServerFacade} from "../network/ServerFacade";

export class StatusService implements Service {
    private serverFacade = new ServerFacade()

    public async loadMoreFeedItems(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null,
    ): Promise<[Status[], boolean]> {
        const req = {
            token: authToken.token,
            userAlias: userAlias,
            pageSize: pageSize,
            lastItem: lastItem
        }
        return await this.serverFacade.getFeedItems(req);
    }

    public async loadMoreStoryItems(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null,
    ): Promise<[Status[], boolean]> {
        const req = {
            token: authToken.token,
            userAlias: userAlias,
            pageSize: pageSize,
            lastItem: lastItem
        }
        return await this.serverFacade.getStoryItems(req)
    }

    public async postStatus(
        authToken: AuthToken,
        newStatus: Status,
    ): Promise<void> {
        const req = {
            token: authToken.token,
            status: newStatus.dto
        }
        await this.serverFacade.postStatus(req)
    }
}
