import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { User } from "./entity/User.ts";

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

  private generateUserKey(user: User) {
  return {
    [this.followerHandleAttr]: user.follower_handle,  // Partition key
    [this.followeeHandleAttr]: user.followee_handle   // Sort key
  };
}
}

async function main() {
  const followsDAO = new FollowsDAO();

  const follower_handle = "@spidey";
  const follower_name = "Spiderman";

  const followee_handle_list = generateHandles(25);
  const followee_name_list = generateNames(25);

  for (let i = 0; i < 25; i++) {
    await followsDAO.recordUser(
      new User(
        follower_handle,
        follower_name,
        followee_handle_list[i]!,
        followee_name_list[i]!,
      ),
    );
    await followsDAO.recordUser(
      new User(
        followee_handle_list[i]!,
        followee_name_list[i]!,
        follower_handle,
        follower_name,
      ),
    );
  }

  const user1 = await followsDAO.getUser(new User(follower_handle, follower_name, '@person1', 'Person1'))
  console.log(user1?.toString())

  await followsDAO.putUser(new User(follower_handle, "Spiderman Miles Morales", '@person25', 'Person 25 in the SpiderVerse'))

  await followsDAO.deleteUser(new User(follower_handle, follower_name, '@person13','Person13'))
}

function generateNames(n: number): string[] {
  const returnList: string[] = [];
  for (let i = 1; i <= n; i++) {
    returnList.push(`Person${i}`);
  }
  return returnList;
}

function generateHandles(n: number): string[] {
  const returnList: string[] = [];
  for (let i = 1; i <= n; i++) {
    returnList.push(`@person${i}`);
  }
  return returnList;
}

main();
