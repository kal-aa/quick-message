import { mongoDb } from "@/app/utils/mongodb";
import { NextResponse } from "next/server";
import twilio from "twilio";

// Get Twilio credentials from environment variables
const accountSid = process.env.TWILIO_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const client = twilio(accountSid, authToken);

// GET function to handle the request and revalidate the status of the sent messages
export async function GET() {
  const db = await mongoDb();

  // Retrieve all messages from the "messages" collection in MongoDB
  const storedMessages = await db.collection("messages").find().toArray();

  // If no messages are found, log and return a response
  if (storedMessages.length === 0) {
    console.log("No messages were found");
    return NextResponse.json({ message: "No sent message has been found" });
  }

  // revalidate the status of each message
  const updatedMessages = await Promise.all(
    storedMessages.map(async (message) => {
      // If the message does not have a Twilio SID, skip the status update
      if (!message.twilioSid) return message;

      try {
        // Fetch the updated message status from Twilio using the SID
        const twilioMessage = await client.messages(message.twilioSid).fetch();

        // Update the message status in MongoDB with the new status
        await db
          .collection("messages")
          .updateOne(
            { _id: message._id },
            { $set: { status: twilioMessage.status } }
          );

        // Return the message with the updated status
        return {
          ...message,
          status: twilioMessage.status,
        };
      } catch (error) {
        // If there's an error fetching the Twilio message status, log the error and return the original message
        console.error(
          `Failed to fetch Twilio status for SID ${message.twilioSid}:`,
          error
        );
        return message;
      }
    })
  );

  // Return the updated list of messages as a JSON response
  return NextResponse.json({ messages: updatedMessages });
}
