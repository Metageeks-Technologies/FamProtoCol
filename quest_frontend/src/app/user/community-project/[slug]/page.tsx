"use client";

import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCommunity } from "@/redux/reducer/communitySlice";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchQuests } from "@/redux/reducer/questSlice";
import UserTable from "@/app/components/table/userTable";
import { LeaderBoardUser } from "@/types/types";
import axios from "axios";
import { notify } from "@/utils/notify";
import { useRouter } from "next/navigation";

export default function CommunityProject ( {
  params,
}: {
  params: { slug: string; };
} )
{
  const columns = [
    { name: "NAME", uid: "name" },
    { name: "FAMPOINTS", uid: "fampoints" },
    { name: "XPS", uid: "xps" },
  ];
  const id = params.slug;
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: community,
    loading,
    error,
  } = useSelector( ( state: RootState ) => state.community );
  const memberId = useSelector( ( state: RootState ) => state.login?.user?._id );
  const currentQuests = useSelector( ( state: any ) => state.quest.currentQuests );
  const user = useSelector((state:RootState)=>state.login.user?._id)
  const [ users, setUsers ] = useState( [] );
  const questIds = community?.quests;
  const userData = community?.members;
  const router = useRouter();
  // console.log( userData, memberId );
  useEffect( () =>
  {
    dispatch( fetchCommunity( id ) );
  }, [ dispatch, id ] );

  useEffect( () =>
  {
    if ( questIds && questIds.length > 0 )
    {
      dispatch( fetchQuests( questIds ) );
    }
  }, [ dispatch, questIds ] );

  useEffect( () =>
  {
    if ( user !== undefined && community?.creator !== undefined && memberId === community?.creator )
    {
      router.push( `/kol/community-project/${ community._id }` );
    }
  }, [ memberId, community, router ] );



  const getUsers = useCallback( async () =>
  {
    if ( !userData ) return;
    const friendsIds = community?.members;
    try
    {
      const { data } = await axios.post( `${ process.env.NEXT_PUBLIC_SERVER_URL }/user/friends`, { friendsIds } );
      // console.log(data)
      // Sort users based on rewards.xps in descending order
      const sortedUsers = data?.friends.sort( ( a: any, b: any ) =>
        ( b.rewards?.xp || 0 ) - ( a.rewards?.xp || 0 )
      );
      setUsers( sortedUsers );
    } catch ( error )
    {
      console.error( "Error fetching friends:", error );
    }
  }, [ userData ] );

  useEffect( () =>
  {
    if ( userData )
    {
      getUsers();
    }
  }, [ userData ] );

  // leave the community
  const handleLeaveCommunity = async () =>
  {
    try
    {
      const { data } = await axios.post( `${ process.env.NEXT_PUBLIC_SERVER_URL }/community/leavecommunity/${ id }`, { memberId } );
      // console.log( data );
      notify( 'success', 'Left community succesfull' );

      router.push( '/allcommunity' );

    } catch ( error )
    {
      console.log(
        "Error leaving community:",
        error
      );
    }
  };



  if ( loading )
  {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-xl font-semibold text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if ( error )
  {
    return (

      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <svg
            className="mx-auto h-16 w-16 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={ 2 }
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 className="mt-4 text-2xl font-bold text-gray-800">Error</h1>
          <p className="mt-2 text-gray-600">{ error }</p>
          <button
            onClick={ () => dispatch( fetchCommunity( id ) ) }
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if ( !community )
  {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <svg
            className="mx-auto h-16 w-16 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={ 2 }
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h1 className="mt-4 text-2xl font-bold text-gray-800">
            No Community Found
          </h1>
          <p className="mt-2 text-gray-600">
            We couldn't find the community you're looking for.
          </p>
          <button
            onClick={ () => window.history.back() }
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black  min-h-screen lg:mx-16 font-famFont uppercase ">
      <div className="container mx-auto px-4 py-8">
        <div className=" rounded-lg shadow-lg overflow-hidden">
          <div className="flex">
            <div className="lg:w-48 lg:h-48 sm:h-40 sm:w-44 h-20 w-28  ">
              <div className="box1 right-trapezium p-[2px] bg-zinc-800 ">
                <img
                  src={community.logo }
                  alt={community.title}
                  className="box2 rounded right-trapezium lg:w-48 lg:h-48 sm:h-40 sm:w-44 h-20 w-28 object-cover"
                />
              </div>
            </div>

            <div className="lg:h-48 sm:h-40 lg:w-full sm:w-full h-20 w-full ">
              <div className="box1 community-clip p-[1px] bg-zinc-800 ">
                <div
                  className="h-full w-full box2 community-clip relative"
                  style={ {
                    background:
                      "linear-gradient(90deg, #000000, #242066, #5A4B82, #7F6493, #000000)",
                  } }
                >
                    <div className="absolute lg:bottom-5 lg:right-5 sm:bottom-5 sm:right-5 bottom-1 right-1 flex sm:p-2 gap-2 place-items-center ">
                    <div className="flex flex-col items-baseline justify-end gap-2 sm:flex-row">
                      <div className="lg:text-lg sm:text-lg text-xs uppercase font-famFont ">
                        {community?.title}
                      </div>
                      <div className="flex gap-2">
                        <div className="flex items-center sm:gap-2 flex-col">
                          <span className="text-white lg:text-xl sm:text-xl text-sm">
                            {community.quests?.length || 0}
                          </span>
                          <span className="text-white font-semibold lg:text-medium sm:text-medium text-xs">
                            QUESTS
                          </span>
                        </div>
                        <div className="flex items-center sm:gap-2 flex-col">
                          <span className="text-white lg:text-xl sm:text-xl text-sm">
                            {community.members?.length || 0}
                          </span>
                          <span className="text-white font-semibold lg:text-medium sm:text-medium text-xs">
                            FOLLOWERS
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

         <div className="flex flex-col-reverse sm:flex-row gap-2 items-start justify-center sm:justify-start lg:mt-4 sm:mt-0 mt-4 mb-8">
            <div className="flex gap-1 justify-center items-center group-hover:bg-[#735dcf]">
              <div className="box1 right-trapezium p-[1px] bg-zinc-800 ">
              <div className="box2 bg-black right-trapezium px-2 py-1" >
               <i className="bi bi-twitter-x"></i>
                </div>
              </div>
              <div className="box1 left-right-trapezium p-[1px] bg-zinc-800">
                <div className="box2 bg-black text-violet-700 left-right-trapezium px-2 py-1 ">
                <i className=" bi bi-discord"></i>
                </div>
              </div>
              <div className="box1 left-trapezium p-[1px] bg-zinc-800 ">
              <div  className="box2 bg-black left-trapezium px-2 py-1 ">
               <i className="bi bi-telegram"></i>
              </div>
              </div>
            </div>
            <div className="flex justify-start items-baseline font-famFont gap-2 lg:mt-0 sm:mt-4">
              <div className="text-white opacity-70">BIO:</div>
              <div className="text-sm text-white opacity-30 ">
                {community?.description || ""}
              </div>
            </div>
          </div>

           <div className="flex justify-end items-center mb-4">
        <button
          className="bg-gray-900 hover:bg-gray-700 text-white font-medium w-full md:w-auto px-5 py-2 rounded-full"
          onClick={() => router.back()}
        >
          Go Back
        </button>
      </div>
        </div>

        <div className="flex lg:flex-row sm:flex-col flex-col sm:mt-16 gap-24 justify-end ">
          <section className="w-full flex flex-col justify-center items-center">

            <div className="hidden sm:flex flex-row justify-center my-2 gap-3 text-pink-950 lg:text-5xl">
              - - - - - - - - - - -
            </div>

            <div className="my-4 flex items-center gap-2 justify-center">
              <div className="">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="11" viewBox="0 0 15 11" fill="none">
                  <path d="M0.5 1H5.98652L14.5 10" stroke="#FA00FF" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5.5 5L10.5 10" stroke="#FA00FF" strokeLinecap="round" />
                </svg>
              </div>
              <div className="text-md capitalize">Leaderboard</div>
            </div>
            <div className="w-[90%] lg:w-[80%] flex userTable justify-center items-center bg-[#040404] ">
              <UserTable<LeaderBoardUser> data={ users } columns={ columns } rowsPerPage={ 5 } />
            </div>
          </section>

          <div className="basis-[50%]">
             <div className="border border-neutral-600 p-2">
              <div className="lg:px-6 sm:px-6 px-2 py-2  flex gap-1 justify-between">
                <div className="w-1/3">
                  <div className="text-white opacity-30 lg:text-lg sm:text-lg text-sm px-2 py-1 border-r-1 border-white">
                    Count down End in:
                  </div>
                </div>

                <div className="w-2/3 px-2">
                  <div className="flex justify-between items-center gap-2 group-hover:bg-[#735dcf]">
                    <div className="box1 right-trapezium p-[1px] bg-zinc-800 relative">
                      <div className="box2 right-trapezium text-center bg-black p-3 relative">
                        1
                        <span className="absolute bottom-[1px] left-[1px] text-xs">
                          D
                        </span>
                      </div>
                    </div>
                    <div className="box1 left-right-trapezium p-[1px] bg-zinc-800">
                      <div className="box2 left-right-trapezium text-center bg-black p-3 relative">
                        2
                        <span className="absolute bottom-[1px] left-[1px] text-xs">
                          H
                        </span>
                      </div>
                    </div>
                    <div className="box1 left-trapezium  p-[1px] bg-zinc-800">
                      <div className="box2 left-trapezium text-center bg-black p-3 relative">
                        3
                        <span className="absolute bottom-[1px] left-[5px] text-xs">
                          M
                        </span>
                      </div>
                    </div>
                     <div className="box1 p-[1px] bg-zinc-800">
                      <div className="box2 text-center bg-black p-3 relative">
                        4
                        <span className="absolute bottom-[1px] left-[1px] text-xs">
                          S
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 border border-neutral-600 lg:p-8 sm:p-8 p-5 ">
              <div className="flex gap-10">
                <div className="lg:h-36 lg:w-48 sm:h-36 sm:w-48  h-24 w-40 bg-[#121212]"></div>

                <div className="flex flex-col gap-5 w-full">
                  <div className="flex items-center gap-2">
                    <h1 className="text-neutral-500">XP</h1>
                    <div className="relative w-full h-1 bg-[#212121]">
                      <div
                        className="bg-[#cb03cf] h-1 absolute"
                        style={ { width: "40%" } }
                      ></div>
                      <div className="text-xs text-[#cb03cf] absolute left-0 top-2">
                        { 40 } XPs
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <h1 className="text-neutral-500">Token:</h1>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                      <div className="text-white">
                        USDC <span className="ml-2">2000</span>
                      </div>
                    </div>
                  </div>
                  <button className=' lg:py-2 lg:px-4 sm:py-2 lg:mt-2 px-4 py-2 bg-famViolate text-white rounded-md hover:bg-violet-700 transition duration-300'
                    onClick={ handleLeaveCommunity }
                  >
                    Leave Community
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="p-2 edu mt-10  grid lg:gap-10 sm:gap-10 gap-4  mx-8  lg:mx-0 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            { currentQuests?.map( ( quest: any, index: number ) => (
              <div
                key={ index }
                onClick={ ( e ) =>
                {
                  e.preventDefault();
                  if ( memberId && userData?.includes( memberId ) )
                  {

                    window.location.href = `/user/quest/${ quest._id }`;
                  } else if (
                    memberId && !userData?.includes( memberId )
                  )
                  {
                    notify( "warn", ' please join  the community' );
                  } else
                  {
                    notify( "warn", ' please login to join the community' );
                  }
                } }
                className=""
              >
                <div>
                  <div className={`box1 education-clip p-[2px]  ${(index%4)===0 && "bg-red-600" } ${(index%4)===1 && "bg-blue-600" } ${(index%4)===2 && "bg-green-600" } ${(index%4)===3 && "bg-yellow-700" } `}>
                    <div className="education-clip box2 h-20 w-40 bg-black flex justify-center items-center p-2">
                       <div className="h-16 w-36">
                      <img
                        src={quest.logo}
                        alt={quest.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    </div>
                  </div>

                  <div className="mt-2 flex gap-3 justify-center">
                    <div>
                      <img
                        src={community.logo}
                        alt={community.title}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-small text-slate-300">{ quest.title }</p>
                    </div>
                  </div>

                  {/* <div>
                    <div className="flex gap-4">
                      <p>{data.description1}</p>
                      <p>{data.description2}</p>
                    </div>

                    <div className="flex gap-4">
                      <p>{data.description3}</p>
                      <p>|</p>
                      <p>{data.description4}</p>
                    </div>
                  </div> */}
                </div>
              </div>
            ) ) }
          </div>
        </div>
      </div>
    </div>
  );
}
