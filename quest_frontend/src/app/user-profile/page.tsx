"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { BallTriangle } from "react-loader-spinner";
import Image from "next/image";

const UserProfile: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const user=useSelector((state:RootState)=>state.login.user)
  const router = useRouter();

  const handleClose = () => {
    setIsOpen(false);
    router.push('/home'); 
  };

  if (!isOpen) return null;
  
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center" style={{zIndex:"10"}}>
        <div className="mt-10 flex flex-col gap-5 text-white">
          <button className="place-self-end text-2xl" onClick={handleClose}>
            X
          </button>
          <div className="bg-slate-400 rounded-xl px-20 py-10 flex flex-col items-center mx-4 hover:bg-slate-300 duration-1000 cursor-pointer">
             {user?(
              <> 
              <img 
                src={user.image}     
              alt="user image"
              className="h-32 w-32 rounded-full mt-4 object-cover"
            /></>
                ):( 
             <> <img 
              src="https://www.defineinternational.com/wp-content/uploads/2014/06/dummy-profile.png"
              alt="user image"
              className="h-32 w-32 rounded-full mt-4 object-cover"
            /></>
              )}
            <div className="mt-4 h-8 w-80 bg-slate-500 rounded-md flex items-center justify-center">
              <p className="text-center">{user?.displayName}</p>
            </div>
            <div className="mt-4 h-8 w-72 bg-slate-500 rounded-md flex items-center justify-center">
              <p className="text-center">Setup Password</p>
            </div>
            <div className="mt-4 h-8 w-64 bg-slate-500 rounded-md flex items-center justify-center">
              <p className="text-center">Enter Invite code</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
