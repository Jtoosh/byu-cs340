import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    QueryCommand,
    UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {User} from "./entity/User.ts";
import {DataPage} from "./entity/DataPage.ts";

export class FollowsDAO {
    readonly tablename = "follows";
    readonly indexName = "follows_index";
    readonly followerHandleAttr = "follower_handle";
    readonly followerNameAttr = "follower_name";
    readonly followeeHandleAttr = "followee_handle";
    readonly followeeNameAttr = "followee_name";

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient({region: 'us-east-1'}));

    async recordUser(user: User): Promise<void> {
        const userInDatabase: User | undefined = await this.getUser(user);
        if (userInDatabase === undefined) {
            await this.putUser(user);
        }
    }

    async putUser(user: User): Promise<void> {
        const params = {
            TableName: this.tablename,
            Item: {
                [this.followerHandleAttr]: user.follower_handle,
                [this.followerNameAttr]: user.follower_name,
                [this.followeeHandleAttr]: user.followee_handle,
                [this.followeeNameAttr]: user.followee_name,
            },
        };
        await this.client.send(new PutCommand(params));
    }

    async getUser(user: User) {
        const params = {
            TableName: this.tablename,
            Key: this.generateUserKey(user),
        };
        const output = await this.client.send(new GetCommand(params));
        return output.Item == undefined
            ? undefined
            : new User(
                output.Item[this.followerHandleAttr],
                output.Item[this.followerNameAttr],
                output.Item[this.followeeHandleAttr],
                output.Item[this.followeeNameAttr],
            );
    }

    async deleteUser(user: User): Promise<void> {
        const params = {
            TableName: this.tablename,
            Key: this.generateUserKey(user),
        };
        await this.client.send(new DeleteCommand(params));
    }

    async getPageOfFollowees(followerHandle: string, pageSize: number, lastFolloweeHandle: string | undefined): Promise<DataPage<User>> {
        const params = {
            KeyConditionExpression: this.followerHandleAttr + "= :f",
            ExpressionAttributeValues: {
                ":f": followerHandle,
            },
            TableName: this.tablename,
            Limit: pageSize,
            ExclusiveStartKey: lastFolloweeHandle === undefined
                ? undefined : {
                    [this.followerHandleAttr]: followerHandle,
                    [this.followeeHandleAttr]: lastFolloweeHandle
                },
        };
        const items: User[] = [];
        const data = await this.client.send(new QueryCommand(params));
        const hasMorePages = data.LastEvaluatedKey !== undefined;
        data.Items?.forEach((item) =>
            items.push(new User(item[this.followerHandleAttr], item[this.followerNameAttr], item[this.followeeHandleAttr], item[this.followeeNameAttr]))
        );
        return new DataPage<User>(items, hasMorePages)
    }

    async getPageOfFollowers(followeeHandle: string, pageSize: number, lastFollowerHandle: string | undefined): Promise<DataPage<User>> {
        const params = {
            KeyConditionExpression: this.followeeHandleAttr + "= :fol",
            ExpressionAttributeValues: {
                ":fol": followeeHandle,
            },
            TableName: this.tablename,
            IndexName: this.indexName,
            Limit: pageSize,
            ExclusiveStartKey: lastFollowerHandle === undefined
                ? undefined : {
                    [this.followerHandleAttr]: lastFollowerHandle,
                    [this.followeeHandleAttr]: followeeHandle
                },
        };
        const items: User[] = [];
        const data = await this.client.send(new QueryCommand(params));
        const hasMorePages = data.LastEvaluatedKey !== undefined;
        data.Items?.forEach((item) =>
            items.push(new User(item[this.followerHandleAttr], item[this.followerNameAttr], item[this.followeeHandleAttr], item[this.followeeNameAttr]))
        );
        return new DataPage<User>(items, hasMorePages)

    }

    private generateUserKey(user: User) {
        return {
            [this.followerHandleAttr]: user.follower_handle,  // Partition key
            [this.followeeHandleAttr]: user.followee_handle   // Sort key
        };
    }
}

