import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
const AdminSidebar = () => {
  const router = useRouter();
  const pathname=usePathname();
  const [activeTab,setActiveTab]=useState("dashboard");

  useEffect(()=>{
    if(pathname==="/admin/dashboard"){
      setActiveTab("dashboard");
    }
    else if(pathname==="/admin/dashboard/community-data"){
      setActiveTab("communityData");
    }
    else if(pathname==="/admin/dashboard/feed-section"){
      setActiveTab("feed");
    }
    else if(pathname==="/admin/dashboard/community-section"){
      setActiveTab("community");
    }
    else if(pathname==="/admin/dashboard/badges"){
      setActiveTab("badges");
    }
    else if(pathname==="/admin/dashboard/grant-section"){
      setActiveTab("grant");
    }

  },[pathname])

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/admin/login");
  };




  return (
    <div className="flex flex-col gap-4 text-black ">
      <div className="font-bold uppercase py-2 px-4 text-xl">Fam Panel</div>
      <div className="py-2 px-4 rounded-md text-black">
        <div className="flex flex-col justify-start items-start gap-2">
          <Link
            href="/admin/dashboard"
            className={`w-full font-bold py-2 px-4 ${activeTab==="dashboard"?" bg-famViolate text-white ":"hover:bg-gray-300"}  rounded-lg  hover:shadow-md`}
          >
            Dashboard
          </Link>

          <Link
            href="/admin/dashboard/community-data"
            className={`w-full font-bold py-2 px-4 ${activeTab==="communityData"?" bg-famViolate text-white ":"hover:bg-gray-300"}  rounded-lg  hover:shadow-md`}
          >
            Community MetaData
          </Link>

          <Link
            href="/admin/dashboard/feed-section"
             className={`w-full font-bold py-2 px-4 ${activeTab==="feed"?" bg-famViolate text-white ":"hover:bg-gray-300"}  rounded-lg  hover:shadow-md`}
          >
            Feed section
          </Link>

          <Link
            href="/admin/dashboard/community-section"
            className={`w-full font-bold py-2 px-4 ${activeTab==="community"?" bg-famViolate text-white ":"hover:bg-gray-300"}  rounded-lg  hover:shadow-md`}
          >
            Community section
          </Link>
          <Link
            href="/admin/dashboard/badges"
            className={`w-full font-bold py-2 px-4 ${activeTab==="badges"?" bg-famViolate text-white ":"hover:bg-gray-300"}  rounded-lg  hover:shadow-md`}
          >
            Badges section
          </Link>

          <Link
            href="/admin/dashboard/grant-section"
            className={`w-full font-bold py-2 px-4 ${activeTab==="grant"?" bg-famViolate text-white ":"hover:bg-gray-300"}  rounded-lg  hover:shadow-md`}
          >
            Grants section
          </Link>

          <div onClick={handleLogout} className="w-full flex justify-start font-bold py-2 px-4 hover:bg-gray-300 text-red-500 cursor-pointer rounded-lg hover:shadow-md">
              Logout
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
