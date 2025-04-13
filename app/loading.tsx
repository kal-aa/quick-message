"use client";

import { HashLoader } from "react-spinners";

// Loading component that displays the spinner while loading
export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <HashLoader size={100} color="#6A5ACD" />
    </div>
  );
}
