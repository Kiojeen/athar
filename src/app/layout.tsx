import type { Metadata } from "next";

import "@/styles/globals.css";

import { env } from "@/env";
import { ConvexClientProvider } from "@/providers/convex-client-provider";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";

import { DirectionProvider } from "@/components/ui/direction";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { amiri } from "@/styles/fonts";

export const metadata: Metadata = {
  title: "أثـر",
  description:
    "أثـر منصة تتيح للطلاب طلب ملابس التخرج بسهولة وتنظيم، مع تجربة سلسة وسريعة لإتمام الطلبات والاستلام في الوقت المحدد.",

  icons: [{ rel: "icon", url: "/favicon.ico" }],

  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  openGraph: {
    type: "website",
    siteName: "أثـر",
    locale: "ar",
    images: {
      url: "/box/box-top.png",
      width: 1200,
      height: 630,
      alt: "Athar opengraph image",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${amiri.variable} ${amiri.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <ConvexAuthNextjsServerProvider storage="localStorage">
          <ThemeProvider
            defaultTheme="light"
            attribute="class"
            enableColorScheme
          >
            <ConvexClientProvider>
              <DirectionProvider dir="rtl" direction="rtl">
                {children}
                <Toaster />
              </DirectionProvider>
            </ConvexClientProvider>
          </ThemeProvider>
        </ConvexAuthNextjsServerProvider>
      </body>
    </html>
  );
}
