"use client";
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown, Avatar, DropdownItem, DropdownMenu, DropdownTrigger, Input, Badge, Button } from "@nextui-org/react";
import axios from 'axios';
import Cookies from 'js-cookie';
import { Toaster } from "react-hot-toast";

import { logoutUser } from '@/redux/reducer/authSlice';
import { AppDispatch, persistor, RootState } from '@/redux/store';
import { notify } from '@/utils/notify';

const Navbar: React.FC = () =>
{
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const [ currentNewsIndex, setCurrentNewsIndex ] = useState( 0 );
    const [ feedItems, setFeedItems ] = useState<string[]>( [] );
    const [ refresh, setRefresh ] = useState( false );

    const user = useSelector( ( state: RootState ) => state.login?.user );

    const getFeeds = useCallback( async () =>
    {
        try
        {
            const response = await axios.get( `${ process.env.NEXT_PUBLIC_SERVER_URL }/feed`, {
                params: { page: 1, limit: 10 },
            } );
            setFeedItems( response.data.feeds );
        } catch ( error )
        {
            console.log( 'error in getting feed :-', error );
        }
    }, [] );

    useEffect( () =>
    {
        getFeeds();
    }, [ getFeeds, refresh ] );

    useEffect( () =>
    {
        const interval = setInterval( () =>
        {
            setCurrentNewsIndex( ( prevIndex ) => ( prevIndex + 1 ) % feedItems.length );
        }, 5000 );

        return () => clearInterval( interval );
    }, [ feedItems.length ] );

    const logoutClient = useCallback( async () =>
        {
    console.log("logout called")    
        try
        {
            const response = await dispatch( logoutUser() );
            // console.log(response)
            if ( response )
            {
                await persistor.flush();
                localStorage.clear();
                Cookies.remove( 'authToken' );
                setRefresh( true );
                router.push( '/home' );
                window.location.reload();
                notify( "success", "Logout Successful" );
                setRefresh( false );
            }
        } catch ( error )
        {
            console.error( 'Error logging out:', error );
        }
    }, [ dispatch, router ] );

    const signup = useCallback( () =>
    {
        router.push( '/login' );
    }, [ router ] );

    // console.log(user)

    return (
        <nav className="bg-black text-white py-2 md:py-4  ml-[8rem] mr-[4rem] ">
            <div className="container mx-auto ">

                {/* Desktop menu */ }
                <div className="hidden lg:flex items-center justify-between space-x-4">
                    {/* searchBar */ }
                    <div className=" flex flex-row justify-start items-center border-gray-300">
                        <div className='search-bar-trapizium p-[1px] text-white bg-[#fffefe4e] '>
                            <input
                                type="text"
                                placeholder="SEARCH"
                                className="bg-black search-bar-trapizium text-[#fff] px-3 py-2.5 w-48 xl:w-64"
                            />
                        </div>
                        <button className="search  text-white px-3 rounded-r">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>


                    {/* news */ }
                    <div className='bg-gradient-to-r from-[#FA00FF] via-[#FF7B7B] to-[#5538CE] text-white h-[40px]'>
                        <div className=" flex flex-row max-w-lg min-w-[200px] xl:min-w-[300px] justify-center items-center">
                            {/* linear-gradient(90deg, #FA00FF 0.03%, #FF7B7B 23.93%, #5538CE 118.3%); */ }

                            <div className="py-1 px-4 rounded overflow-hidden relative w-full ">
                                <span className="absolute left-0 top-0 bottom-0 bg-transparent px-2 flex items-center font-bold p-2 z-10 news-text" >
                                    <div className='border-r-1 pr-2'>
                                        NEWS
                                    </div>
                                </span>
                                <div className="inline-block ticker-wrap ml-16">
                                    <div className="ticker">
                                        { feedItems && feedItems.length > 0 ? (
                                            feedItems.map( ( item: any, index: number ) => (
                                                <div key={ index } className="ticker__item">{ item?.title }</div>
                                            ) )
                                        ) : (
                                            <div className="ticker__item">No news available at the moment</div>
                                        ) }
                                    </div>
                                </div>
                            </div>
                            <div className='w-7 mr-1'>
                                <div className='news-clip h-[36px] pl-1 pr-1 bg-gray-900 flex justify-center items-center'>
                                    <svg className="" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M4.45496 9.96001L7.71496 6.70001C8.09996 6.31501 8.09996 5.68501 7.71496 5.30001L4.45496 2.04001" stroke="white" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>

                        </div>
                    </div>
                    {/* profile */ }
                    <div className=" flex justify-evenly items-center">
                        { user ? (
                            <Dropdown placement="bottom-end" className="bg-slate-800">
                                <DropdownTrigger>
                                    <Avatar
                                        isBordered
                                        as="button"
                                        className="transition-transform"
                                        color="secondary"
                                        name="Jason Hughes"
                                        size="sm"
                                        src={ user?.image || 'https://png.pngtree.com/thumb_back/fh260/background/20230612/pngtree-man-wearing-glasses-is-wearing-colorful-background-image_2905240.jpg' }
                                    />
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Profile Actions" variant="flat">
                                    <DropdownItem key="profile" className="h-10 font-bold">
                                        {/* <p className="font-semibold">welcome { data.displayName }</p> */ }
                                        <p className="font-semibold text-center" onClick={ () => router.push( '/user/profile' ) } >View profile</p>
                                    </DropdownItem>
                                    <DropdownItem key="logout" color="danger" onClick={ logoutClient } className="bg-[#f31260] text-white">
                                        <div className="font-bold text-white text-center">Logout</div>
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        ) : (
                            <button className='rounded bg-blue-700' onClick={ signup }>
                                <div className="py-1 px-4 rounded">
                                    <div className='m-1 w-full'>Sign in / up</div>
                                </div>
                            </button>
                        ) }
                        {/* notification */ }
                        <div className="relative px-2">
                            <Badge content="99+" shape="circle" color="danger">
                                <Button
                                    radius="full"
                                    isIconOnly
                                    aria-label="more than 99 notifications"
                                    variant="light"
                                >
                                    <i className="bi bi-bell-fill text-white text-xl"></i>
                                </Button>
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile and Tablet menu */ }
            <div className="lg:hidden md:mt-4 ml-0">
                <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white py-2 px-4 rounded overflow-hidden relative h-[40px]">
                    <span className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-purple-600 to-purple-600 px-1 flex items-center z-10 border-r-2">
                        NEWS
                    </span>
                    <div className="ticker-wrap ml-16">
                        <div className="ticker">
                            { feedItems && feedItems.length > 0 ? (
                                feedItems.map( ( item: any, index: number ) => (
                                    <div key={ index } className="ticker__item">{ item?.title }</div>
                                ) )
                            ) : (
                                <div className="ticker__item">No news available at the moment</div>
                            ) }
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
