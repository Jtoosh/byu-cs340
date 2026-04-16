import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { StatusDAO } from "../interfaces/StatusDAO";
import { ServerError, StatusDto } from "tweeter-shared";
import { StatusDso } from "../interfaces/dso/StatusDso";

export class DynamoStatusDAO implements StatusDAO {
  readonly tableName = "status";
  readonly userAliasAttr = "user_alias";
  readonly timestampAttr = "timestamp";
  readonly statusTextAttr = "status_text";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient({ region: "us-west-2" }));

  async createStatus(status: StatusDto): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.userAliasAttr]: status.user.alias,
        [this.timestampAttr]: status.timestamp,
        [this.statusTextAttr]: status.post,
      },
    };
    await this.client.send(new PutCommand(params));
  }

  async getStatusesPage(userAlias: string, pageSize: number, lastItem: StatusDto | null): Promise<[StatusDso[], boolean]> {
    const params = {
      KeyConditionExpression: this.userAliasAttr + "= :alias",
      ExpressionAttributeValues: {
        ":alias": userAlias,
      },
      TableName: this.tableName,
      Limit: pageSize,
      ExclusiveStartKey:
        lastItem === null 
          ? undefined
          : {
              [this.userAliasAttr]: lastItem!.user.alias,
              [this.timestampAttr]: lastItem!.timestamp,
            },
      ScanIndexForward: false,
    };

    const items: StatusDso[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;

    data.Items?.forEach((item) =>
      items.push({
        post: item[this.statusTextAttr],
        userAlias: item[this.userAliasAttr],
        timestamp: item[this.timestampAttr],
      }),
    );
    return [items, hasMorePages];
  }

  async getStatus(userAlias: string, timestamp: number): Promise<StatusDso> {
    const params = {
      TableName: this.tableName,
      Key: this.generateStatusKey(userAlias, timestamp),
    };
    const output = await this.client.send(new GetCommand(params));

    if (!output.Item) {
      throw new ServerError("Status not found");
    } else {
      return {
        userAlias: output.Item[this.userAliasAttr],
        post: output.Item[this.statusTextAttr],
        timestamp: output.Item[this.timestampAttr],
      };
    }
  }

  private generateStatusKey(userAlias: string, timestamp: number) {
    return {
      [this.userAliasAttr]: userAlias, //Partition key
      [this.timestampAttr]: timestamp, //sort key
    };
  }
}
