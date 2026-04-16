import { FollowService } from "../../service/FollowService";
import { DynamoDAOFactory } from "../../data/factory/DynamoDAOFactory";
import { NotFoundError, UserDto } from "tweeter-shared";
import { MessageService } from "../../service/MessageService";
import { StatusDso } from "../../data/interfaces/dso/StatusDso";
import { FeedDso } from "../../data/interfaces/dso/FeedDso";

const MAX_BATCH_WRITE_AMOUNT = 25;

export const handler = async (event: any) => {
  //Potentially need to wrap in try catch and send response codes
  const MAX_MESSAGE_AMOUNT = 10;
  const followService = new FollowService(new DynamoDAOFactory());
  const messageService = new MessageService("", "https://sqs.us-west-2.amazonaws.com/615299777283/Update-Feed-Queue");

  const postedStatusDso: StatusDso = JSON.parse(event.Records[0].body);
  let errorCount = 0;
  const [followerPage, hasMore] = await followService.loadMoreFollowers(postedStatusDso.userAlias, 10000, null);
  const followerPageChunks: FeedDso[][] = [];

  let numUserBatches = Math.ceil(followerPage.length / MAX_BATCH_WRITE_AMOUNT);

  for (let i = 0; i < numUserBatches; i++) {
    followerPageChunks.push(
      followerPage.slice(i * MAX_BATCH_WRITE_AMOUNT, Math.min(i * MAX_BATCH_WRITE_AMOUNT + MAX_BATCH_WRITE_AMOUNT, followerPage.length)).map(follower => ({ownerAlias: follower.alias, ...postedStatusDso })),
    );
  }
  console.log("Number of chunks to go to DB:", numUserBatches);
  console.log("All chunks:", followerPageChunks);

  let numberMessages = Math.ceil(followerPageChunks.length / MAX_MESSAGE_AMOUNT)
  for (let i = 0; i < numberMessages; i++) {
    try {
      await messageService.batchSendMessages(
        followerPageChunks.slice(i * MAX_MESSAGE_AMOUNT, Math.min(i * MAX_MESSAGE_AMOUNT + MAX_MESSAGE_AMOUNT, followerPageChunks.length)),
      );
    } catch (error) {
      console.error("Error sending feed update messages:", error);
      errorCount++;
    }
  }
};
