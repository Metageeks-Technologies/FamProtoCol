"use client";
import React, { useEffect, useRef, useState } from 'react';
import { RiMenu2Fill } from 'react-icons/ri';
import { GiCrossMark } from 'react-icons/gi';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import LoginPage from './mob-login';
import { useRouter, usePathname } from 'next/navigation';


const Sidebar = () =>
{
  const [ nav, setNav ] = useState<boolean>( true );
  const router = useRouter();
  const pathname = usePathname();
  const user = useSelector( ( state: RootState ) => state.login?.user );

  const handleNav = () =>
  {
    setNav( !nav );
  };

  const handleLinkClick = ( path: string ) =>
  {
    setNav( true );
    router.push( path );
  };

  const prevPathRef = useRef( pathname );

  useEffect( () =>
  {
    if ( pathname === "/login" || prevPathRef.current === "/login" )
    {
      setNav( false );
      if ( pathname === "/login" )
      {
        router.push( '/home' );
      }
    }
    prevPathRef.current = pathname;
  }, [ pathname, router ] );



  return (
    <>
      <div className='w-[4rem] flex flex-row  md:flex-col justify-center items-center border-r-gray-600/45 md:border-r bg-[#15151557] z-50 fixed md:h-screen glass_effect top-0'>
        < Link href="/" className='hidden md:flex'><div className='border-b-gray-600/45 flex justify-center items-center md:border-b border-b w-[4rem] h-[5rem]'><img src="https://clusterprotocol2024.s3.amazonaws.com/website+logo/logo.png" alt="logo" /></div></Link>
        {/* <button className="justify-center border-none text-white text-2xl cursor-pointer" onClick={ handleNav }> */ }
        { nav ? (
          <div className='p-2 items-center justify-center m-auto'>
            {/* <button onClick={ handleNav } ><RiMenu2Fill size={ 40 } className="text-[#e2dcdcb3] cursor-pointer" /></button> */}
          </div>
        ) : (
          <div className='p-2 items-center justify-center m-auto'>
            <button onClick={ handleNav } ><GiCrossMark size={ 40 } className="text-[#e2dcdcb3] cursor-pointer" /></button>
          </div>
        ) }
        {/* </button> */ }
      </div>
      <div className={ `top-0 flex flex-col w-screen md:w-full bg-[#5638ce40] z-40 h-screen glass_effect fixed ${ nav ? 'transform -translate-x-full' : '' } transition-transform duration-500 ease-in-out` }>
        <button className="block md:hidden border-none text-white text-2xl cursor-pointer" onClick={ handleNav }>
          { nav ? (
            <div className='px-2 m-auto'>
              <RiMenu2Fill size={ 40 } className="text-[#e2dcdcb3] cursor-pointer" />
            </div>
          ) : (
            <div className='px-2 m-auto'>
              <GiCrossMark size={ 40 } className="text-[#e2dcdcb3] cursor-pointer" />
            </div>
          ) }
        </button>

        { user ? (
          <div className="flex-col border-none justify-between md:flex-row items-center flex m-auto md:ml-5 w-screen text-center text-white">
            <div className='justify-center items-center m-auto border-l border-r flex h-12 md:h-40 md:border-r w-[12rem] md:w-full border-r-white' onClick={ () => handleLinkClick( '/user/profile' ) }>
              <div className="border-l md:w-full hover:bg-opacity-15 hover:bg-[#5638ce48] border-t w-full p-3 md:border-l-transparent border-b border-b-white hover:border-b-4 hover:border-b-voilet-700 cursor-pointer" >
                <button >PROFILE</button>
              </div>
            </div>
            <div className='justify-center items-center m-auto border-l flex h-12 md:h-40 border-r w-[12rem] md:w-full border-r-white' onClick={ () => handleLinkClick( "/user/my-community" ) }>
              <div className="md:w-full border-t w-full hover:bg-opacity-15 hover:bg-[#5638ce40] border-b p-3 hover:border-b-4 hover:border-b-voilet-700 cursor-pointer">
                <button > My Community </button>
              </div>
            </div>
            <div className='justify-center items-center m-auto border-l flex h-12 md:h-40 border-r w-[12rem] md:w-full border-r-white' onClick={ () => handleLinkClick( '/leaderboard' ) }>
              <div className="md:w-full border-t w-full hover:bg-opacity-15 hover:bg-[#5638ce40] border-b p-3 hover:border-b-4 hover:border-b-voilet-700 cursor-pointer">
                <button>LEADERBOARD</button>
              </div>
            </div>
            <div className='justify-center items-center m-auto border-l border-r flex h-12 md:h-40 md:border-r w-[12rem] md:w-full border-r-white' onClick={ () => handleLinkClick( '/' ) }>
              <div className="md:w-full border-t w-full hover:bg-opacity-15 hover:bg-[#5638ce40] border-b p-3 hover:border-b-4 hover:border-b-voilet-700 cursor-pointer">
                <button>REWARDS</button>
              </div>
            </div>
            <div className='justify-center items-center m-auto border-l border-r flex h-12 md:h-40 md:border-r w-[12rem] md:w-full border-r-white' onClick={ () => handleLinkClick( '/user/rate-kols' ) }>
              <div className="md:w-full border-t w-full hover:bg-opacity-15 hover:bg-[#5638ce40] border-white border-b md:border-r-transparent md:border-r hover:border-b-4 hover:border-b-violet-700 p-3">
                <button >RANK KOLS</button>
              </div>
            </div>
          </div>
        ) : (
          <LoginPage setNav={ setNav } />
        ) }
      </div>
    </>
  );
};

export default Sidebar;