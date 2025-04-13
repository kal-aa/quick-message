"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isMessagesPage = pathname.startsWith("/sent-messages");

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="relative z-10">
      {/* Navbar button */}
      <button
        onClick={toggleMenu}
        className="space-y-2 z-10 absolute top-4 left-4" // Adjust the position as needed
      >
        <div
          className={`w-7 h-1 bg-black dark:bg-white transition-all duration-300 ${
            isOpen ? "translate-y-3 rotate-45" : ""
          }`}
        ></div>
        <div
          className={`w-7 h-1 bg-black dark:bg-white transition-all duration-300 ${
            isOpen ? "opacity-0" : ""
          }`}
        ></div>
        <div
          className={`w-7 h-1 bg-black dark:bg-white transition-all duration-300 ${
            isOpen ? "-translate-y-3 -rotate-45" : ""
          }`}
        ></div>
      </button>

      {/* Mobile Menu */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } absolute -top-3 pl-16 bg-white dark:bg-black p-4 shadow-lg w-full`}
      >
        <ul className="space-y-2">
          <li>
            <Link
              href="/"
              className={`${
                !isMessagesPage
                  ? "text-blue-400 border-b"
                  : "hover:text-blue-900 dark:hover:text-blue-100"
              }`}
            >
              Contacts
            </Link>
          </li>
          <li>
            <Link
              href="/sent-messages"
              className={`${
                isMessagesPage
                  ? "text-blue-400 border-b"
                  : "hover:text-blue-900 dark:hover:text-blue-100"
              }`}
            >
              Sent Messages
            </Link>
          </li>
        </ul>
      </div>

      {/* The children won't be pushed down because the navbar and menu are positioned absolutely */}
    </div>
  );
}
