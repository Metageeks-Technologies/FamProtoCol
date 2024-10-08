import type { Metadata } from "next";
import "./globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import localFont from "next/font/local";
import { Providers } from "./provider";
import MainLayout from "@/app/components/MainLayout/mainLayout";

// laptop 1440x900
// mobile 375x667

const proFontWindows = localFont({
  src: [
    {
      path: "../../public/fonts/ProFontWindows.ttf",
      weight: "400",
    },
  ],
  variable: "--font-proFont",
});

const qanelas = localFont({
  src: [
    {
      path: "../../public/fonts/qanelas/QanelasRegular.otf",
      weight: "400",
    },
  ],
  variable: "--font-qanelas",
});

export const metadata: Metadata = {
  title: "FamProtocol",
  description:
    "FamProtocol: Internet Just got Evolved. Be a part of this revolution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${proFontWindows.variable} ${qanelas.variable}`}
    >
      <body>
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  );
}
