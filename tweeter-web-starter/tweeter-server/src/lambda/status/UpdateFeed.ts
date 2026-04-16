import { DynamoDAOFactory } from "../../data/factory/DynamoDAOFactory";
import { FeedDso } from "../../data/interfaces/dso/FeedDso";
import { StatusService } from "../../service/StatusService";

export const handler = async (event: any) => {
  const statusService = new StatusService(new DynamoDAOFactory());

  const feedUpdateBatches: FeedDso[][] = [];

  for (const record of event.Records) {
    
    const messageBody = JSON.parse(record.body);
   console.log("Message body", messageBody) // Parse the stringified message
    feedUpdateBatches.push(messageBody);
  }
  console.log("Feed update batches", feedUpdateBatches);

  await Promise.all(
    feedUpdateBatches.map((feedUpdateBatch) => {
      const ownerAliases = feedUpdateBatch.map((item) => item.ownerAlias);
      console.log("Owner aliases", ownerAliases)
      return statusService.updateFeed(
        {
          userAlias: feedUpdateBatch[0].userAlias,
          post: feedUpdateBatch[0].post,
          timestamp: Number(feedUpdateBatch[0].timestamp),
        },
        ownerAliases,
      );
    }),
  );
  console.timeEnd('start write')
};
