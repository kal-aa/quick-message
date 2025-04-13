import Link from "next/link";
import contacts from "./data/contacts.json";

export default async function ContactsPage() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
      {/* Loop through contacts array */}
      {contacts.map((contact) => (
        <Link
          // Dynamic route to individual contact page
          href={`/contact/${contact.id}`}
          key={contact.id}
          className="contact-list group"
        >
          {/* Full name */}
          <p className="text-xl font-semibold text-white/70 dark:text-black">
            {`${contact.firstName} ${contact.lastName}`}
          </p>

          {/* Phone number */}
          <p className="text-sm text-gray-400 dark:text-gray-600">
            {contact.phone}
          </p>

          {/* Hover text positioned bottom center */}
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-blue-600 hidden group-hover:block">
            See more
          </p>
        </Link>
      ))}
    </div>
  );
}
