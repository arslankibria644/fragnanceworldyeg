import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/components/providers/AuthProvider";
import ThemeProvider from "@/components/providers/ThemeProvider";

export const metadata: Metadata = {
  title: {
    default: "Fragrance World YEG - Premium Fragrances & Decants",
    template: "%s | Fragrance World YEG",
  },
  description:
    "Discover the world's finest perfumes and exclusive decants. Shop luxury fragrances from top brands like Dior, Chanel, Tom Ford, and more.",
  keywords: [
    "luxury perfumes",
    "fragrance decants",
    "designer perfumes",
    "niche fragrances",
    "perfume shop",
    "buy perfume online",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "Fragrance World YEG",
    title: "Fragrance World YEG - Premium Fragrances & Decants",
    description:
      "Discover the world's finest perfumes and exclusive decants.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Fragrance World YEG",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fragrance World YEG - Premium Fragrances & Decants",
    description: "Discover the world's finest perfumes and exclusive decants.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <ThemeProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#1a1a1a",
                  color: "#fff",
                  borderLeft: "3px solid #d4af37",
                  borderRadius: "0",
                  fontSize: "14px",
                },
              }}
            />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
