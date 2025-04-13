"use client";

import { useEffect, useState } from "react";
import { EnrichedMessage, Message } from "../utils/type";
import contacts from "../data/contacts.json";
import { HashLoader } from "react-spinners";

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

  // Render loading state if messages are still being fetched
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[55vh]">
        <HashLoader size={100} color="#6A5ACD" />
      </div>
    );
  }

  // Render error message if something goes wrong
  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  // Render message list if there are no errors and messages are fetched
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
          </div>
        );
      })}
    </div>
  );
}
