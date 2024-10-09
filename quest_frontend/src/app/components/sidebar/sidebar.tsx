"use client";
import React, { useEffect, useRef, useState } from "react";
import { RiMenu2Fill } from "react-icons/ri";
import { GiCrossMark } from "react-icons/gi";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import LoginPage from "@/app/components/login/mob-login";
import DomainLogin from "@/app/components/login/domainLogin";
import { useRouter, usePathname } from "next/navigation";
import { toggleNav, selectNavState } from "@/redux/reducer/navSlice";
import { RootState, AppDispatch } from "@/redux/store";

const Sidebar = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();
  const [isLandingPage, setIsLandingPage] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.login?.user);
  const navOpen = useSelector((state: RootState) => selectNavState(state));

  const handleNav = () => {
    dispatch(toggleNav(!navOpen));
  };

  const handleLinkClick = (path: string) => {
    dispatch(toggleNav(false));
    router.push(path);
  };

  const prevPathRef = useRef(pathname);

  useEffect(() => {
    if (pathname === "/login" || prevPathRef.current === "/login") {
      dispatch(toggleNav(false));
      router.push("/home");
    }
    if (pathname === "/" || pathname === "" || pathname === "/user/referral/dashboard") {
      // console.log("landing page", pathname);
      setIsLandingPage(true);
    } else {
      setIsLandingPage(false);
    }
    prevPathRef.current = pathname;
  }, [router, pathname]);

  return (
    <>
      <div className="w-[4rem] hidden sm:flex flex-col border-r-gray-600/45 bg-[#15151557] z-50 fixed md:h-screen glass_effect top-0">
        <Link
          href="#" //change this to the home page
          className="fixed top-0 left-0 flex justify-center items-center border-b-gray-600/45 md:border-b border-b w-full h-[5rem]"
        >
          <img
            src="https://clusterprotocol2024.s3.amazonaws.com/website+logo/websiteLogo.png"
            alt="logo"
          />
        </Link>
        <div className="flex-1 flex items-center justify-center ">
          <button
            className={`hidden border-none text-white text-2xl cursor-pointer`}//comment this and uncomment below
            // className={`${
            //   isLandingPage ? "hidden" : "flex items-center justify-center"
            // }`}
            onClick={handleNav}
          >
            {!navOpen ? (
              <RiMenu2Fill
                size={40}
                className="text-[#e2dcdcb3] cursor-pointer"
              />
            ) : (
              <GiCrossMark
                size={40}
                className="text-[#e2dcdcb3] cursor-pointer"
              />
            )}
          </button>
        </div>
      </div>
      <div
        className={`top-0 flex flex-col w-screen md:w-full bg-[#5638ce40] z-40 h-screen glass_effect fixed ${
          !navOpen ? "transform -translate-x-full" : ""
        } transition-transform duration-500 ease-in-out`}
      >
        {user ? (
          <>
            {/* desktop sidebar */}
            <div className="hidden sm:flex flex-col border-none justify-between sm:flex-row items-center m-auto md:ml-5 w-screen text-center text-white">
              <div
                className="justify-center items-center m-auto border-l border-r flex h-12 md:h-40 md:border-r w-[12rem] md:w-full border-r-white"
                onClick={() => handleLinkClick("/user/profile")}
              >
                <div className="border-l md:w-full hover:bg-opacity-15 hover:bg-[#5638ce48] border-t w-full p-3 md:border-l-transparent border-b border-b-white hover:border-b-4 hover:border-b-voilet-700 cursor-pointer">
                  <button>PROFILE</button>
                </div>
              </div>
              <div
                className="justify-center items-center m-auto border-l flex h-12 md:h-40 border-r w-[12rem] md:w-full border-r-white"
                onClick={() => handleLinkClick("/user/my-community")}
              >
                <div className="md:w-full border-t w-full hover:bg-opacity-15 hover:bg-[#5638ce40] border-b p-3 hover:border-b-4 hover:border-b-voilet-700 cursor-pointer">
                  <button> MY COMMUNITY </button>
                </div>
              </div>
              <div
                className="justify-center items-center m-auto border-l flex h-12 md:h-40 border-r w-[12rem] md:w-full border-r-white"
                onClick={() => handleLinkClick("/leaderboard")}
              >
                <div className="md:w-full border-t w-full hover:bg-opacity-15 hover:bg-[#5638ce40] border-b p-3 hover:border-b-4 hover:border-b-voilet-700 cursor-pointer">
                  <button>LEADERBOARD</button>
                </div>
              </div>
              <div
                className="justify-center items-center m-auto border-l border-r flex h-12 md:h-40 md:border-r w-[12rem] md:w-full border-r-white"
                onClick={() => handleLinkClick("/user/points-parlor")}
              >
                <div className="md:w-full capitalize border-t w-full hover:bg-opacity-15 hover:bg-[#5638ce40] border-b p-3 hover:border-b-4 hover:border-b-voilet-700 cursor-pointer">
                  <button>POINTS PARLOUR</button>
                </div>
              </div>
              <div
                className="justify-center items-center m-auto border-l border-r flex h-12 md:h-40 md:border-r w-[12rem] md:w-full border-r-white"
                onClick={() => handleLinkClick("/user/rate-kols")}
              >
                <div className="md:w-full border-t w-full hover:bg-opacity-15 hover:bg-[#5638ce40] border-b p-3 hover:border-b-4 hover:border-b-voilet-700 cursor-pointer">
                  <button>RANK KOLS</button>
                </div>
              </div>
            </div>
            {/* mobile sidebar */}
            <div className="sm:hidden flex flex-col gap-8 justify-center items-center w-[90%] mx-auto h-[90vh] ">
              <div className="flex flex-col gap-6 mb-4 border-none justify-between w-full items-center text-center text-white font-qanelas ">
                <div
                  className="flex w-full h-12 md:h-40 justify-center items-center m-auto border-x-1 p-4 border-x-[#ffffff47] "
                  onClick={() => handleLinkClick("/home")}
                >
                  <div className=" hover:bg-opacity-15 hover:bg-[#5638ce48] w-full px-8 py-6 border-b-1 border-b-[#ffffff47] cursor-pointer">
                    HOME
                  </div>
                </div>
                <div
                  className="flex w-full h-12 md:h-40 justify-center items-center m-auto border-x-1 p-4 border-x-[#ffffff47] "
                  onClick={() => handleLinkClick("/user/profile")}
                >
                  <div className=" hover:bg-opacity-15 hover:bg-[#5638ce48] w-full px-8 py-6 border-b-1 border-b-[#ffffff47] cursor-pointer">
                    PROFILE
                  </div>
                </div>
                <div
                  className="flex w-full h-12 md:h-40 justify-center items-center m-auto border-x-1 p-4 border-x-[#ffffff47] "
                  onClick={() => handleLinkClick("/user/my-community")}
                >
                  <div className="hover:bg-opacity-15 hover:bg-[#5638ce48] w-full px-8 py-6 border-b-1 border-b-[#ffffff47] cursor-pointer">
                    MY COMMUNITY
                  </div>
                </div>
                <div
                  className="flex w-full h-12 md:h-40 justify-center items-center m-auto border-x-1 p-4 border-x-[#ffffff47] "
                  onClick={() => handleLinkClick("/leaderboard")}
                >
                  <div className="hover:bg-opacity-15 hover:bg-[#5638ce48] w-full px-8 py-6 border-b-1 border-b-[#ffffff47] cursor-pointer">
                    LEADERBOARD
                  </div>
                </div>
                <div
                  className="flex w-full h-12 md:h-40 justify-center items-center m-auto border-x-1 p-4 border-x-[#ffffff47] "
                  onClick={() => handleLinkClick("/user/points-parlor")}
                >
                  <div className="hover:bg-opacity-15 hover:bg-[#5638ce48] w-full px-8 py-6 border-b-1 border-b-[#ffffff47] cursor-pointer">
                    POINTS PARLOUR
                  </div>
                </div>
                <div
                  className="flex w-full h-12 md:h-40 justify-center items-center m-auto border-x-1 p-4 border-x-[#ffffff47] "
                  onClick={() => handleLinkClick("/user/rate-kols")}
                >
                  <div className="hover:bg-opacity-15 hover:bg-[#5638ce48] w-full px-8 py-6 border-b-1 border-b-[#ffffff47] cursor-pointer">
                    RANK KOLS
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center gap-4">
                <div className="border-1 border-[#ffffff59] bg-[#ffffff17] p-2 w-12 h-12 ">
                  <img
                    src="https://clusterprotocol2024.s3.amazonaws.com/website+logo/logo.png"
                    className="w-full h-full object-cover"
                    alt="logo"
                  />
                </div>
                <div
                  className="border-1 border-[#ffffff59] bg-[#ffffff17]  flex justify-center items-center w-12 h-12"
                  onClick={handleNav}
                >
                  <i className="bi bi-x-lg"></i>
                </div>
              </div>
            </div>
          </>
        ) : (
          <DomainLogin />
        )}
      </div>
    </>
  );
};

export default Sidebar;
