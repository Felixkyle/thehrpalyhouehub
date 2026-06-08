import type { Metadata } from "next";
import { Providers } from "@/lib/providers";
import "./design-system.css";

export const metadata: Metadata = {
  title: "The HR Playhouse Hub",
  description:
    "HR Playhouse Hub is a research-backed, gamified, story-driven HR learning platform — from your first role to the executive table.",
  icons: {
    icon: "/assets/HrPlayhouseHublogo-BcNoBwC7.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@300;400;500;700;800;900&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
