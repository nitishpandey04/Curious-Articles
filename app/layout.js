import Navbar from '@/components/NavBar.js';
import Providers from "@/components/Providers"; // adjust path if needed
// import { SessionProvider } from "next-auth/react";
import "./globals.css";

export const metadata = {
  title: "Curious Articles",
  description: "Curious Articles",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main className="p-4">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
