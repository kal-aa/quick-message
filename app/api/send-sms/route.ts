import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { mongoDb } from "@/app/utils/mongodb";

// Initialize Twilio client with credentials from environment variables
const twilioClient = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// POST function to handle the incoming requests
export async function POST(req: NextRequest) {
  try {
    // Parse the incoming request body to get phone, message, and OTP
    const { phone, message, otp } = await req.json();

    // Send the SMS message using Twilio API
    const response = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    // Check if the message status is "queued", "sent", or "delivered"
    if (
      response.status === "queued" ||
      response.status === "sent" ||
      response.status === "delivered"
    ) {
      // If the message is successfully queued, sent, or delivered, insert into the database
      const db = await mongoDb();
      await db.collection("messages").insertOne({
        phone,
        otp,
        message,
        status: response.status,
        twilioSid: response.sid,
        sentAt: new Date(),
      });

      return NextResponse.json({ success: true, message: response });
    } else throw new Error(`Message failed with status: ${response.status}`);
  } catch (error) {
    // Catch any errors that occur during the message sending process
    console.error("SMS error:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }
    // If the error is not an instance of Error, return a generic error message
    return NextResponse.json(
      { success: false, message: "Failed to send SMS" },
      { status: 500 }
    );
  }
}
