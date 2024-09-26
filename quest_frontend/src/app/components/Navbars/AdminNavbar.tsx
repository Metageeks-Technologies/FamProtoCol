"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [drop, setDrop] = useState(false);
  const router = useRouter();
  const handleClose = () => {
    setDrop(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/admin/login");
  };

  return (
    <nav
      className="bg-slate-800 border-gray-500  text-white w-full overflow-hidden"
      style={{ zIndex: "1000" }}
    >
      <div className="flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          href="/admin/dashboard"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img
            src="https://clusterprotocol2024.s3.amazonaws.com/website+logo/logo.png"
            className="h-8 "
            alt="Fam"
            width={32}
            height={32}
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Fam Admin panel
          </span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
