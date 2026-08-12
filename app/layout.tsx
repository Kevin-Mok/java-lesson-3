import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Java Robotics Lesson 3",
  description: "2-hour robot composition and safety lesson for high-school robotics students"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-slate-950 text-slate-100">{children}</div>
      </body>
    </html>
  );
}
