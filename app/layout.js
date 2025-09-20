import Navbar from '@/components/NavBar.js';
import "./globals.css";

export const metadata = {
  title: "Curious Articles",
  description: "Curious Articles",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="p-4">
          {children}
        </main>
      </body>
    </html>
  );
}