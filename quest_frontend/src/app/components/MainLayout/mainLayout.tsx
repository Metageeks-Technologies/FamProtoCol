// layout/MainLayout.
"use client";
import { usePathname } from 'next/navigation';
import Navbar from '@/app/components/Navbars/Navbar';
import AdminNavbar from '@/app/components/Navbars/AdminNavbar';
import Footer from '@/app/components/Footer';
import { NextUIProvider } from "@nextui-org/react";
import Sidebar from '@/app/components/sidebar/sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {RainBowProviders} from '@/app/components/rainbowkit/rainbowKitWrapper'

const MainLayout = ( {
  children,
}: Readonly<{
  children: React.ReactNode;
}> ) =>
{
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith( '/admin' );
  const isLandingRoute = (pathname === '/' || pathname==="/payment-bridge");

  return (
    <div>
      <RainBowProviders>
      <NextUIProvider>
        { isAdminRoute ? ( <AdminNavbar /> ) : (!isLandingRoute && <Navbar />)}
        {!isAdminRoute && <Sidebar />}
        <main className={`min-h-screen ${isAdminRoute?'':'md:ml-[4rem]'}`}>{ children }</main>
        <ToastContainer />
      {/* {(!isLandingRoute || !isAdminRoute) &&  <Footer /> } */}
      </NextUIProvider>
      </RainBowProviders>
    </div>
  );
};

export default MainLayout;
