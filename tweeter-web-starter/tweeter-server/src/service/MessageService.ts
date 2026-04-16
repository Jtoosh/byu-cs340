import {
  SQSClient,
  SendMessageCommand,
  ReceiveMessageCommand,
  SendMessageBatchCommand,
  ReceiveMessageCommandOutput,
} from "@aws-sdk/client-sqs";
import { Dso } from "../data/interfaces/dso/Dso";
import { NotFoundError } from "tweeter-shared";

export class MessageService {
  private receive_sqs_url: string;
  private send_sqs_url: string;
  private sqsClient: SQSClient;

  public constructor(receive_url: string, send_url: string) {
    this.receive_sqs_url = receive_url;
    this.send_sqs_url = send_url;
    this.sqsClient = new SQSClient();
  }

  public async sendMessage(message: Dso): Promise<void> {
    const params = {
      MessageBody: JSON.stringify(message),
      QueueUrl: this.send_sqs_url,
    };
    try {
      const data = await this.sqsClient.send(new SendMessageCommand(params));
      console.log("Success, message sent. MessageID:", data.MessageId);
    } catch (err) {
      throw err;
    }
  }

  public async batchSendMessages(itemList: Dso[]): Promise<void> {
    const messageItems = itemList.map((item, id) => ({
      Id: `${id}`,
      MessageBody: JSON.stringify(item),
    }));
    console.log("messageItems:", messageItems);
    const params = {
      QueueUrl: this.send_sqs_url,
      Entries: messageItems,
    };
    console.log("Params", params);

    const response = await this.sqsClient.send(new SendMessageBatchCommand(params));
    const succeeded = response.Successful ?? [];
    const failed = response.Failed ?? [];

    console.log(`Sent: ${succeeded.length}, Failed: ${failed.length}`);

    if (failed.length > 0) {
      throw new Error(`${failed.length} messages failed to send`);
    }
  }

  //Will return an un-parsed JSON string
  public async receiveMessage(): Promise<string> {
    const response = await this.receiveAndValidate(1);
    if (response.Messages![0].Body === undefined) {
      throw new NotFoundError("No content in message body");
    }
    return response.Messages![0].Body;
  }

  public async receiveMessages(): Promise<string[]> {
    const messageBodies = [];
    const response = await this.receiveAndValidate(10);
    for (let message of response.Messages!) {
      if (message.Body === undefined) {
        throw new NotFoundError("No content in message body");
      } else {
        messageBodies.push(message.Body);
      }
    }
    return messageBodies;
  }

  private async receiveAndValidate(messageCount: number): Promise<ReceiveMessageCommandOutput> {
    const response = await this.sqsClient.send(
      new ReceiveMessageCommand({
        QueueUrl: this.receive_sqs_url,
        MaxNumberOfMessages: messageCount,
      }),
    );

    if (response.Messages === undefined) {
      throw new NotFoundError("No messages in Post Status Queue");
    }
    return response;
  }
}
