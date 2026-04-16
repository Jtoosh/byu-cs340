import { FillFollowTableDAO } from "./DynamoDAO/FillFollowTableDAO";
import { FillUserTableDAO } from "./DynamoDAO/FillUserTableDAO";
import { User } from "tweeter-shared";

// Increase the write capacities for the follow table, follow index, and user table, AND REMEMBER TO DECREASE THEM after running this script

const mainUsername = "@10user";
const baseFollowerAlias = "@10follower";
const followerPassword = "password";
const followerImageUrl = "https://jt-340-user-images.s3.us-west-2.amazonaws.com/image/10user";
const baseFollowerFirstName = "10";
const baseFollowerLastName = "Follower";

const numbUsersToCreate = 10;
const numbFollowsToCreate = numbUsersToCreate;
const batchSize = 25;
const aliasList: string[] = Array.from(
  { length: numbUsersToCreate },
  (_, i) => baseFollowerAlias + (i + 1),
);

const fillUserTableDao = new FillUserTableDAO();
const fillFollowTableDao = new FillFollowTableDAO();

main();

async function main() {
  console.log("Creating users");
  await createUsers(0);

  console.log("Creating follows");
  await createFollows(0);

  console.log("Increasing the followee's followers count");
  await fillUserTableDao.increaseFollowersCount(
    mainUsername,
    numbUsersToCreate,
  );

  console.log("Done!");
}

async function createUsers(createdUserCount: number) {
  const userList = createUserList(createdUserCount);
  await fillUserTableDao.createUsers(userList, followerPassword);

  createdUserCount += batchSize;

  if (createdUserCount % 1000 == 0) {
    console.log(`Created ${createdUserCount} users`);
  }

  if (createdUserCount < numbUsersToCreate) {
    await createUsers(createdUserCount);
  }
}

function createUserList(createdUserCount: number) {
  const users: User[] = [];

  // Ensure that we start at alias 1 rather than alias 0.
  const start = createdUserCount + 1;
  const limit = start + batchSize;

  for (let i = start; i < limit; ++i) {
    let user = new User(
      `${baseFollowerFirstName}_${i}`,
      `${baseFollowerLastName}_${i}`,
      `${baseFollowerAlias}${i}`,
      followerImageUrl,
    );

    users.push(user);
  }

  return users;
}

async function createFollows(createdFollowsCount: number) {
  const followList = aliasList.slice(
    createdFollowsCount,
    createdFollowsCount + batchSize,
  );

  await fillFollowTableDao.createFollows(mainUsername, followList);

  createdFollowsCount += batchSize;

  if (createdFollowsCount % 1000 == 0) {
    console.log(`Created ${createdFollowsCount} follows`);
  }

  if (createdFollowsCount < numbFollowsToCreate) {
    await createFollows(createdFollowsCount);
  }
}