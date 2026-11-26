"use client";

import { usePathname } from 'next/navigation';
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import MobileNav from "@/components/MobileNav";
import BackToTop from "@/components/BackToTop";

export default function ProfileFrame({children}: {children: React.ReactNode}) {
  const path = usePathname();
  if (['/research-map', '/genealogy'].includes(path.replace(/\/$/, ''))) {
    return <main id="main-content" tabIndex={-1}>{children}</main>;
  }
  return <>
    <MobileNav />
    <Header />

    <div className="container mx-auto px-4 mt-2 md:-mt-12 relative z-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar (Desktop) */}
        <Sidebar />

        {/* Main Content */}
        <main id="main-content" tabIndex={-1} className="col-span-1 lg:col-span-9 min-h-dvh outline-none">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>
    </div>

    <Footer />
    <BackToTop />
  </>;
}
