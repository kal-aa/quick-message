"use client";

import "./globals.css";

// Global error component for handling errors
export default function globalError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-5 font-serif">
      <h2 className="text-xl ">Oops! Some thing went wrong</h2>
      <button
        onClick={() => window.location.reload()}
        className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
      >
        Try again
      </button>
    </div>
  );
}
