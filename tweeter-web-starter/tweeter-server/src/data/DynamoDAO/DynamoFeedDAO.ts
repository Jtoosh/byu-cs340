import { FeedDAO } from "../interfaces/FeedDAO";
import { StatusDto, ServerError } from "tweeter-shared";
import { StatusDso } from "../interfaces/dso/StatusDso";
import { DynamoDBDocumentClient, QueryCommand, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class DynamoFeedDAO implements FeedDAO {
  readonly tableName = "feed";
  readonly feedOwnerAliasAttr = "owner_alias";
  readonly postTimestampAttr = "timestamp";
  readonly authorAliasAttr = "author_alias";
  readonly statusTextAttr = "status_text";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient({ region: "us-west-2" }));

  async getFeedPage(userAlias: string, token: string, pageSize: number, lastItem: StatusDto | null): Promise<[StatusDso[], boolean]> {
    const params = {
      KeyConditionExpression: this.feedOwnerAliasAttr + "= :owner_alias",
      ExpressionAttributeValues: {
        ":owner_alias": userAlias,
      },
      TableName: this.tableName,
      Limit: pageSize,
      ExclusiveStartKey:
        lastItem === null
          ? undefined
          : {
              [this.feedOwnerAliasAttr]: lastItem!.user.alias,
              [this.postTimestampAttr]: lastItem!.timestamp,
            },
      ScanIndexForward: false,
    };
    const items: StatusDso[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;

    data.Items?.forEach((item) =>
      items.push({
        post: item[this.statusTextAttr],
        userAlias: item[this.authorAliasAttr],
        timestamp: item[this.postTimestampAttr],
      }),
    );
    return [items, hasMorePages];
  }

  //note: this method was implemented agentically using Opencode
  async updateFeed(newStatus: StatusDso, followeeAliases: string[]): Promise<void> {
    console.log("Entered update feed");
    const chunkSize = 25;

    const chunkArray = <T>(arr: T[], size: number): T[][] => {
      const chunks: T[][] = [];
      for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
      }
      return chunks;
    };

    const chunks = chunkArray(followeeAliases, chunkSize);
    console.log("made chunks")
    const errors: { chunk: number; error: Error }[] = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const putRequests = chunk.map((followerAlias) => ({
        PutRequest: {
          Item: {
            [this.feedOwnerAliasAttr]: followerAlias,
            [this.postTimestampAttr]: newStatus.timestamp,
            [this.authorAliasAttr]: newStatus.userAlias,
            [this.statusTextAttr]: newStatus.post,
          },
        },
      }));

      const params = {
        RequestItems: {
          [this.tableName]: putRequests,
        },
      };

      console.log("About to send batch " + i + " to DB");
      try {
        console.log("Sending batch " + i + " to DB");
        await this.client.send(new BatchWriteCommand(params));
        console.log("Batch sent to DB");
      } catch (error) {
        console.log(`Error writing batch ${i}:`, error);

        errors.push({ chunk: i, error: error as Error });
      }
    }

    if (errors.length > 0) {
      const failedCount = errors.reduce((sum, e) => sum + chunks[e.chunk].length, 0);
      throw new ServerError(`Failed to write ${failedCount} feed items. ${errors.length} batch(es) failed.`);
    }
  }
}
