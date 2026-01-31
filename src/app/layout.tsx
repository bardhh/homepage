import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { Providers } from "./providers";
import PageTransition from "@/components/PageTransition";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
  variable: "--font-poppins"
});

export const metadata: Metadata = {
  title: "Dr. Bardh Hoxha | Senior Principal Scientist",
  description: "Research in Cyber-Physical Systems and Autonomous Systems",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg outline-none ring-2 ring-offset-2 ring-blue-600 dark:ring-offset-slate-900 transition-transform"
        >
          Skip to main content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Bardh Hoxha",
              "url": "https://www.bhoxha.com",
              "jobTitle": "Senior Principal Scientist",
              "affiliation": {
                "@type": "Organization",
                "name": "Toyota Research Institute of North America"
              },
              "sameAs": [
                "https://twitter.com/bardhhoxha",
                "https://github.com/bardhh",
                "https://www.linkedin.com/in/bardhhoxha",
                "https://scholar.google.com/citations?user=kK7LubkAAAAJ&hl=en"
              ]
            })
          }}
        />
        <Providers>
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
        </Providers>
      </body>
    </html>
  );
}
