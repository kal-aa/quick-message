import { Contact } from "@/app/utils/type";
import contacts from "../../data/contacts.json";
import Link from "next/link";

// The page receives the params with the contact ID
export default async function ContactPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Find the contact with the matching ID from contacts.json
  const contact: Contact = contacts.find((contact) => contact.id === id)!;

  /* mx-[10%] p-6 py-8 rounded-lg shadow-lg space-y-4 text-center bg-black dark:bg-white dark:text-black! */

  return (
    <div className="mx-[10%] md:mx-[20%]">
      <div className="contact-list">
        <p className="text-xl font-semibold text-white/70 dark:text-black">{`${contact.firstName} ${contact.lastName}`}</p>
        <p className="text-sm text-gray-400 dark:text-gray-600">
          {contact.phone}
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          {contact.position} at {contact.company}
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-600">
          {contact.email}
        </p>
        <Link href={`/contact/${id}/send-to/${contact.phone}`}>
          <button className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-600/90">
            Send Message
          </button>
        </Link>
      </div>
    </div>
  );
}
