import { hash } from "bcryptjs";
import { UserDAO } from "../interfaces/UserDAO";
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UserDso } from "../interfaces/dso/UserDso";
import { NotFoundError } from "tweeter-shared";

export class DynamoUserDAO implements UserDAO {
  readonly tableName = "user";
  readonly userAliasAttr = "user_alias";
  readonly hashedPasswordAttr = "hashed_pass";
  readonly nameAttr = "name";
  readonly imageURLAttr = "image_url";
  readonly followerCountAttr = "follower_count";
  readonly followeeCountAttr = "followee_count";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient({ region: "us-west-2" }));

  async createUser(firstName: string, lastName: string, alias: string, password: string, imageURL: string): Promise<void> {
    const hashed_pass = await hash(password, 10)
    
    const params = {
      TableName: this.tableName,
      Item: {
        [this.userAliasAttr]: alias,
        [this.hashedPasswordAttr]: hashed_pass,
        [this.nameAttr]: firstName + " " + lastName,
        [this.imageURLAttr]: imageURL,
        [this.followerCountAttr]: 0,
        [this.followeeCountAttr]: 0,
      },
    };
    await this.client.send(new PutCommand(params));
  }

  async getUser(userAlias: string): Promise<UserDso> {
    const params = {
      TableName: this.tableName,
      Key: { [this.userAliasAttr]: userAlias },
    };
    const output = await this.client.send(new GetCommand(params));

    if (!output.Item) {
      throw new NotFoundError(`User ${userAlias} not found.`)
    } else {
      const [firstName, lastName] = output.Item[this.nameAttr].split(" ");
      return {
        firstName: firstName,
        lastName: lastName,
        alias: output.Item[this.userAliasAttr],
        imageUrl: output.Item[this.imageURLAttr],
        passwordHash: output.Item[this.hashedPasswordAttr],
        followerCount: output.Item[this.followerCountAttr],
        followeeCount: output.Item[this.followeeCountAttr],
      };
    }
  }
  async incrementFollowers(userAlias: string): Promise<void> {
    await this.countUpdater(userAlias, this.followerCountAttr, true);
  }
  async decrementFollowers(userAlias: string): Promise<void> {
    await this.countUpdater(userAlias, this.followerCountAttr, false);
  }
  async incrementFollowees(userAlias: string): Promise<void> {
    await this.countUpdater(userAlias, this.followeeCountAttr, true)
  }
  async decrementFollowees(userAlias: string): Promise<void> {
    await this.countUpdater(userAlias, this.followeeCountAttr, false);
  }

  private async countUpdater(userAlias: string, attribute: string, increment: boolean) {
    const params = {
      TableName: this.tableName,
      Key: { [this.userAliasAttr]: userAlias },
      ExpressionAttributeValues: { ":inc": increment ? 1 : -1 },
      UpdateExpression: "SET " + attribute + " = " + attribute + " + :inc",
    };
    await this.client.send(new UpdateCommand(params))
  }
}
