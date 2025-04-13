"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function SendMessagePage() {
  const params = useParams();
  if (!params.phone) throw new Error("The phone number is missing!");

  const phone = decodeURIComponent(params.phone as string);
  const [otp, setOtp] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Generate OTP when the component is mounted
  useEffect(() => {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000);
    setOtp(generatedOtp);
    setMessage(`Hi, Your OTP is: ${generatedOtp}`);
  }, []);

  // Handle the click on the send button and send the message to the API
  const handleSendMessage = async () => {
    // Check if the message is empty and return an error if so
    if (!message.trim()) {
      setError("Message cannot be empty.");
      return;
    }

    // Validate if phone number exists
    if (!phone) {
      setError("Invalid phone number");
      return;
    }

    setError("");
    setIsSending(true);
    try {
      // Send the message via API
      const response = await fetch("/api/send-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, message, otp }),
      });

      const { message: mssg } = await response.json();
      if (!response.ok) {
        setError(mssg);
        throw new Error("Failed to send message");
      }

      toast.success("Message sent successfully.");
      console.log(mssg || "Message sent successfully");
      router.push("/sent-messages");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto rounded-xl shadow-md space-y-4">
      {/* Extend the OTP here if the user deletes it in the text field */}
      <h2 className="text-2xl font-semibold">
        New Message:{" "}
        <span>{otp && !message.includes(otp?.toString()) && otp}</span>
      </h2>
      <textarea
        className="w-full p-2 border border-gray-300 rounded-md cursor-pointer"
        value={message}
        rows={4}
        onChange={(e) => setMessage(e.target.value)}
        title="Read Only"
      />
      {/* Show error if one occurs */}
      {error && <p className="text-red-500 -my-1 mb-0.5">{error}</p>}
      <button
        onClick={handleSendMessage}
        disabled={isSending}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500"
      >
        {isSending ? "Sending..." : "Send"}
      </button>
    </div>
  );
}
