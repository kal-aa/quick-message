import { mongoDb } from "@/app/utils/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

// DELETE handler to remove a message by its ID
export async function DELETE(req: NextRequest) {
  try {
    // Extracting the 'id' from the request body
    const { id } = await req.json();

    // If 'id' is not provided, throw an error
    if (!id) throw new Error("Missing ID");

    // Connect to the MongoDB database
    const db = await mongoDb();

    // Attempt to delete the message document with the given _id
    const result = await db.collection("messages").deleteOne({
      _id: new ObjectId(id),
    });

    // If no documents were deleted, return a 404 response
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Message not found" },
        { status: 404 }
      );
    }

    // If successful, return a success response
    return NextResponse.json({ success: true });
  } catch (error) {
    // Handle and return any server-side errors
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
