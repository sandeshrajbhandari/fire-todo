"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import { UserContext } from "./context/AuthContext";
import { useContext } from "react";
import { useUserData } from "./lib/hooks";

export default function RootLayout({ children }) {
  const userData = useUserData();
  // console.log(userData);

  return (
    <UserContext.Provider value={userData}>
      <html lang="en">
        <body>{children}</body>
      </html>
    </UserContext.Provider>
  );
}
