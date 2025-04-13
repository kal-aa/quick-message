"use client";

import { useEffect, useState } from "react";
import { EnrichedMessage, Message } from "../utils/type";
import contacts from "../data/contacts.json";
import { HashLoader } from "react-spinners";
import { toast } from "react-toastify";

export default function SentMessages() {
  const [messages, setMessages] = useState<EnrichedMessage[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // useEffect to fetch messages when the component mounts
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Fetch the sent messages from API
        const response = await fetch("/api/sent-messages");
        const result = await response.json();

        // Handle API errors
        if (!response.ok)
          throw new Error(
            `Error occured while fetching sent messages ${result.message}`
          );

        // Sort messages by sent date in descending order and enrich with full name from contacts
        const enrichedMessages = result.messages
          .sort(
            (a: Message, b: Message) =>
              new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
          )
          .map((message: Message) => {
            const contact = contacts.find((c) => c.phone === message.phone);

            return {
              ...message,
              fullname: `${contact?.firstName} ${contact?.lastName}`,
            };
          });

        setMessages(enrichedMessages);
      } catch (error) {
        if (error instanceof Error) setError(error.message);
        setError("An unexpected error occured");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // Handle message deletion with optimistic UI update
  const handleDelete = async (id: string) => {
    // Optimistically update UI by removing the message immediately
    const updatedMessages = messages.filter((msg) => msg._id.toString() !== id);
    setMessages(updatedMessages);

    try {
      const response = await fetch("/api/delete-message", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error("Server responded with error");

      // Show success toast
      toast.success("Message deleted successfully");
    } catch (error) {
      // Log error and rollback to previous message list
      console.log("An error occured while deleting message", error);
      setMessages(messages);
    }
  };

  // Show loading spinner while messages are being fetched
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[55vh]">
        <HashLoader size={100} color="#6A5ACD" />
      </div>
    );
  }

  // Show error if something went wrong during fetch
  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  // Show fallback if no messages were found
  if (messages.length === 0) {
    return <div className="text-center">No messages sent</div>;
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {messages.map((message) => {
        const sentAt = new Date(message.sentAt);
        return (
          <div key={message._id.toString()} className="contact-list">
            <p className="text-xl font-semibold text-white/70 dark:text-black">{`${message.fullname}`}</p>
            <p className="text-sm text-gray-400 dark:text-gray-600">
              OTP: {message.otp}
            </p>
            <div className="flex justify-center space-x-3 text-sm text-gray-400 dark:text-gray-600">
              <p>{message.status}</p>
              <p>{sentAt.toLocaleDateString()}</p>
            </div>
            <p className="text-sm text-gray-400 dark:text-gray-600">
              {message.message}
            </p>
            <button
              onClick={() => handleDelete(message._id.toString())}
              className="text-white bg-blue-500 px-2
             py-0.5 rounded-lg hover:bg-blue-500/80"
            >
              Delete
            </button>
          </div>
        );
      })}
    </div>
  );
}
