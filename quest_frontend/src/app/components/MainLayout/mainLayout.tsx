// layout/MainLayout.
"use client";
import { usePathname } from 'next/navigation';
import Navbar from '../Navbars/Navbar';
import AdminNavbar from '../Navbars/AdminNavbar';
import Footer from '../Footer';
import { NextUIProvider } from "@nextui-org/react";
import Sidebar from '../sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MainLayout = ( {
  children,
}: Readonly<{
  children: React.ReactNode;
}> ) =>
{
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith( '/admin' );
  const isLandingRoute = pathname === '/';

  return (
    <div>
      <NextUIProvider>
        { isAdminRoute ? ( <AdminNavbar /> ) : ( !isLandingRoute && <Navbar /> )}
        {!isAdminRoute && <Sidebar />}
        <main className={`min-h-screen ${isAdminRoute?'':'md:ml-[4rem]'}`}>{ children }</main>
        <ToastContainer />
        <Footer />
      </NextUIProvider>
    </div>
  );
};

export default MainLayout;
