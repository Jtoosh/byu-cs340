import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

let sqsClient = new SQSClient();

async function sendMessage(): Promise<void> {
    const sqs_url = "https://sqs.us-west-2.amazonaws.com/615299777283/class_demo_queue";
    const messageBody = "Bro ipsum dolor sit amet whistler gaper wack euro brain bucket greasy berm afterbang single track endo heli crank afterbang free ride huckfest.";

    const params = {
        DelaySeconds: 10,
        MessageBody: messageBody,
        QueueUrl: sqs_url,
    };

    try {
        const data = await sqsClient.send(new SendMessageCommand(params));
        console.log("Success, message sent. MessageID:", data.MessageId);
    } catch (err) {
        throw err;
    }
}

sendMessage();