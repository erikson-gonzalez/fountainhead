import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Fountainhead — Tom Geldschläger",
  description:
    "Berlin-based guitarist, producer, and mixing engineer. Production, lessons, and studio sessions.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/*
          next-themes wired for the first time (§1). Single hardcoded dark theme
          today, so defaultTheme="dark" + enableSystem={false} preserves the look
          exactly; attribute="class" only stamps class="dark" on <html> while the
          design tokens live on :root, so nothing changes visually.
        */}
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
