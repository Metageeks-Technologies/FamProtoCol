"use client";
import AdminSidebar from "@/app/components/sidebar/adminSidebar";

export default function AdminLayout ( {
  children,
}: Readonly<{
  children: React.ReactNode;
}> )
{
  return (
    <div className="bg-gray-100 flex justify-center gap-2 sm:justify-between items-center min-h-screen">
       <div className="w-1/5 h-screen bg-white px-4 py-2 ml-2 my-2 rounded-md" ><AdminSidebar/></div> 
      <div className="w-4/5 bg-white px-4 py-2 ml-2 my-2 rounded-md h-screen" >{children}</div>
    </div>
  );
}
