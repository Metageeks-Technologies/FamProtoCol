"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Navbar = () =>
{
  const [ isMenuOpen, setIsMenuOpen ] = useState( false );
  const [ drop, setDrop ] = useState( false );
  const router = useRouter();
  const handleClose = () =>
  {
    setDrop( false );
  };

  const handleLogout = () =>
  {
      localStorage.removeItem("token");
      router.push("/admin/login");
  }

  return (
    <nav className="bg-gray-800 border-gray-200 text-white w-full overflow-hidden" style={{zIndex:"1000"}}>
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/admin/dashboard" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8 "
            alt="Flowbite Logo"
            width={ 32 }
            height={ 32 }
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Admin panel
          </span>
        </Link>

        {/* Search bar */ }
        <div className="flex md:order-2 lg:order-1 mr-32"  >
          <div className="relative hidden md:block ">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
              <span className="sr-only">Search icon</span>
            </div>
            <input
              type="text"
              id="search-navbar"
              className="block w-full p-2 ps-10  text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-cyan-500 dark:focus:border-cyan-500"
              placeholder="Search..."
            />
          </div>
        </div>

        <div>
          <button
            type="button"
            className="relative inline-flex items-center p-3 text-sm font-medium text-center text-white bg-cyan-700 rounded-lg hover:bg-cyan-800 focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
          >
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 16"
            >
              <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
              <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
            </svg>
            <span className="sr-only">Notifications</span>
            <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900">
              2
            </div>
          </button>
        </div>

        {/* Menu toggle buttons */ }
        <div className="flex md:order-3">
          <button
            // onClick={ () => setIsMenuOpen( !drop ) }
            type="button"
            className="md:hidden text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 me-1"
          >
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            <span className="sr-only">Search</span>
          </button>
          <button
            onClick={ () => setDrop( true ) }
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg  hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-search"
            aria-expanded={ isMenuOpen }
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>

        {/* Pop up */ }
        <div
          className={ `fixed top-0 right-0 h-full w-64 bg-gray-900 rounded-md text-white transform ${ drop ? "translate-x-0" : "translate-x-full"
            } transition-transform duration-300 ease-in-out z-10` }
        >
          <div className="flex justify-end p-4">
            <button
              onClick={ handleClose }
              className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg w-8 h-8 flex justify-center items-center"
            >
              <svg
                className="w-8 h-8"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6.707 6.293a1 1 0 0 1 1.414 0L10 8.586l2.879-2.88a1 1 0 1 1 1.414 1.414L11.414 10l2.879 2.879a1 1 0 1 1-1.414 1.414L10 11.414l-2.879 2.879a1 1 0 1 1-1.414-1.414L8.586 10 5.707 7.121a1 1 0 0 1 0-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <ul className="flex flex-col justify-center text-white items-center">
            <li className="flex justify-center items-center  font-bold my-4 hover:text-cyan-500">
              <Link href="/admin/dashboard">Dashboard</Link>
            </li>
            <li className="flex justify-center items-center font-bold my-4 hover:text-cyan-500">
              <Link href="/admin/dashboard/add-community-data">Community MetaData</Link>
            </li>
            <li className="flex justify-center items-center font-bold my-4 hover:text-cyan-500">
              <Link href="/admin/dashboard/feed-section">Feed section</Link>
            </li>
             <li className="flex justify-center items-center font-bold my-4 hover:text-cyan-500">
              <Link href="/admin/dashboard/community-section">Community section</Link>
            </li>
            <li className="flex justify-center items-center font-bold my-4 hover:text-cyan-500">
            <Link href="/admin/dashboard/grant-section">Grants section</Link>
            </li>
            <li className="flex justify-center items-center font-bold my-4 hover:text-cyan-500">
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>

        {/* Navigation menu */ }
        <div
          className={ `items-center justify-between ${ isMenuOpen ? "block" : "hidden"
            } w-full md:flex md:w-auto md:order-1` }
          id="navbar-search"
        >
          <div className="relative mt-3 md:hidden">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="search-navbar-mobile"
              className="block w-full p-2 ps-96 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-cyan-500 dark:focus:border-cyan-500"
              placeholder="Search..."
            />
          </div>
          <ul className="flex lg:ml-48 flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 ">
            <li className="mb-2 md:mb-2 md:inline-block">
              <Link
                href="/admin/dashboard"
                className="block py-2 px-3  rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-cyan-700 md:p-0 dark:text-white md:dark:hover:text-cyan-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Dashboard
              </Link>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;