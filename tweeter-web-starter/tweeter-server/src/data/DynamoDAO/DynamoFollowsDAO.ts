import { FollowsDAO } from "../interfaces/FollowsDAO";
import { DeleteCommand, DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class DynamoFollowsDAO implements FollowsDAO {
  readonly tableName = "follows";
  readonly indexName = "follows_index";
  readonly followerHandleAttr = "follower_handle";
  readonly followeeHandleAttr = "followee_handle";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient({ region: "us-west-2" }));

  async getFollowees(userAlias: string,  pageSize: number, lastItem: string | null): Promise<[string[], boolean]> {
    const params = {
      KeyConditionExpression: this.followerHandleAttr + "= :f",
      ExpressionAttributeValues: {
        ":f": userAlias,
      },
      TableName: this.tableName,
      Limit: pageSize,
      ExclusiveStartKey:
        lastItem === null
          ? undefined
          : {
              [this.followerHandleAttr]: userAlias,
              [this.followeeHandleAttr]: lastItem,
            },
    };
    const items: string[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;

    data.Items?.forEach((item) => items.push(item[this.followeeHandleAttr]));
    return [items, hasMorePages];
  }

  async getFollowers(userAlias: string, pageSize: number, lastItem: string | null): Promise<[string[], boolean]> {
    const params = {
      KeyConditionExpression: this.followeeHandleAttr + "= :fol",
      ExpressionAttributeValues: {
        ":fol": userAlias,
      },
      TableName: this.tableName,
      IndexName: this.indexName,
      Limit: pageSize,
      ExclusiveStartKey:
        lastItem === null
          ? undefined
          : {
              [this.followerHandleAttr]: lastItem,
              [this.followeeHandleAttr]: userAlias,
            },
    };
    const items: string[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;

    data.Items?.forEach((item) => items.push(item[this.followerHandleAttr]));
    return [items, hasMorePages];
  }

  async follow(targetUserAlias: string, sourceUserAlias: string, token: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.followerHandleAttr]: sourceUserAlias,
        [this.followeeHandleAttr]: targetUserAlias,
      },
    };
    await this.client.send(new PutCommand(params));
  }

  async unfollow(targetUserAlias: string, sourceUserAlias: string, token: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: this.generateFollowsKey(targetUserAlias, sourceUserAlias),
    };
    await this.client.send(new DeleteCommand(params));
  }

  private generateFollowsKey(targetUserAlias: string, sourceUserAlias: string) {
    return {
      [this.followerHandleAttr]: sourceUserAlias, // Partition key
      [this.followeeHandleAttr]: targetUserAlias, // Sort key
    };
  }
}
