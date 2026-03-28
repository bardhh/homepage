import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { Providers } from "./providers";
import PageTransition from "@/components/PageTransition";
import MobileNav from "@/components/MobileNav";
import BackToTop from "@/components/BackToTop";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ 
  weight: ['400', '700'],
  subsets: ["latin"],
  variable: "--font-poppins"
});

export const metadata: Metadata = {
  title: "Dr. Bardh Hoxha | Senior Principal Scientist",
  description:
    "Dr. Bardh Hoxha — Senior Principal Scientist at Toyota Research Institute. Expert in Cyber-Physical Systems verification, temporal logics, motion planning, and autonomous systems safety.",
  keywords: [
    "Bardh Hoxha",
    "Cyber-Physical Systems",
    "Autonomous Systems",
    "Formal Methods",
    "Temporal Logic",
    "Motion Planning",
    "Control Barrier Functions",
    "Toyota Research",
    "CPS Verification",
  ],
  authors: [{ name: "Bardh Hoxha" }],
  metadataBase: new URL("https://www.bhoxha.com"),
  alternates: {
    canonical: "https://www.bhoxha.com",
  },
  openGraph: {
    title: "Dr. Bardh Hoxha | Senior Principal Scientist",
    description:
      "Senior Principal Scientist at Toyota Research Institute of North America. Research in CPS Verification, Temporal Logics, and Autonomous Systems.",
    url: "https://www.bhoxha.com",
    siteName: "Bardh Hoxha",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Dr. Bardh Hoxha - Senior Principal Scientist at Toyota Research Institute of North America",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dr. Bardh Hoxha | Senior Principal Scientist",
    description:
      "Research in CPS Verification, Temporal Logics, and Autonomous Systems at Toyota Research Institute of North America.",
    creator: "@bardhhoxha",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "theme-color": "#3b82f6",
    "apple-mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans antialiased">
        <GoogleAnalytics />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg outline-none ring-2 ring-offset-2 ring-blue-600 dark:ring-offset-slate-900 transition-transform"
        >
          Skip to main content
        </a>
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Person",
                "name": "Bardh Hoxha",
                "url": "https://www.bhoxha.com",
                "jobTitle": "Senior Principal Scientist",
                "affiliation": {
                  "@type": "Organization",
                  "name": "Toyota Research Institute of North America"
                },
                "alumniOf": {
                  "@type": "Organization",
                  "name": "Arizona State University"
                },
                "knowsAbout": [
                  "Cyber-Physical Systems",
                  "Temporal Logic",
                  "Motion Planning",
                  "Autonomous Systems",
                  "Formal Verification",
                  "Control Barrier Functions"
                ],
                "sameAs": [
                  "https://x.com/bardhhoxha",
                  "https://github.com/bardhh",
                  "https://www.linkedin.com/in/bardhhoxha",
                  "https://scholar.google.com/citations?user=kK7LubkAAAAJ&hl=en"
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "Dr. Bardh Hoxha",
                "url": "https://www.bhoxha.com"
              }
            ])
          }}
        />
        <Providers>
          <MobileNav />
          <Header />
          
          <div className="container mx-auto px-4 mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Sidebar (Desktop) */}
              <Sidebar />
              
              {/* Main Content */}
              <main id="main-content" tabIndex={-1} className="col-span-1 lg:col-span-9 min-h-screen outline-none">
                <PageTransition>
                  {children}
                </PageTransition>
              </main>
            </div>
          </div>

          <Footer />
          <BackToTop />
        </Providers>
      </body>
    </html>
  );
}
