import { AuthDAO } from "../interfaces/AuthDAO";
import { AuthTokenDto, UnauthorizedError } from "tweeter-shared";
import { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { time } from "console";

export class DynamoAuthDAO implements AuthDAO {
  readonly tableName = "sessions";
  readonly index_name = "sessions_index";
  readonly tokenAttr = "token";
  readonly userAliasAttr = "user_alias";
  readonly timestampAttr = "timestamp";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient({ region: "us-west-2" }));

  async createAuth(userAlias: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.tokenAttr]: uuidv4(),
        [this.userAliasAttr]: userAlias,
        [this.timestampAttr]: Date.now(),
      },
    };
    await this.client.send(new PutCommand(params));
  }

  async deleteAuth(token: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: { [this.tokenAttr]: token },
    };

    await this.client.send(new DeleteCommand(params));
  }

  async getAuth(userAlias: string): Promise<AuthTokenDto> {
    const params = {
      TableName: this.tableName,
      IndexName: this.index_name,
      KeyConditionExpression: this.userAliasAttr + " = :alias",
      ExpressionAttributeValues: {
        ":alias": userAlias,
      },
    };
    const output = await this.client.send(new QueryCommand(params));

    if (!output.Items) {
      throw new UnauthorizedError("No active session found");
    } else {
      return {
        token: output.Items[0].token,
        timestamp: output.Items[0].timestamp,
      };
    }
  }

  async updateAuth(token: string, timestamp: number): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: { [this.tokenAttr]: token },
      UpdateExpression:
      "SET " + this.timestampAttr + " = "  + timestamp
    }
    await this.client.send(new UpdateCommand(params))
  }
}
