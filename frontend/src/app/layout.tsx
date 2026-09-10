import type { Metadata } from "next";
import type { ReactNode } from "react";
import { IBM_Plex_Sans_Arabic, Amiri } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const archivo = IBM_Plex_Sans_Arabic({
  variable: "--font-archivo",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const spectral = Amiri({
  variable: "--font-spectral",
  subsets: ["arabic"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "منهج — ذاكر بالمنهج بتاعك فعلاً",
  description: "اسأل، اتمرن بالكويز والفلاش كارد على مادتك الحقيقية — كل إجابة بتتنقل للسلايد أو الامتحان اللي جايه منه.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${archivo.variable} ${spectral.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
