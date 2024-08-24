"use client";

import { use, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchQuests } from "@/redux/reducer/questSlice";
import Image from "next/image";
import UserTable from "@/app/components/table/userTable";
import { User } from "@/app/leaderboard/data";
import axios from "axios";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchAllCommunities, fetchCommunity, joinCommunity } from "@/redux/reducer/communitySlice";
import { useRouter } from "next/navigation";
import { notify } from "@/utils/notify";
import ReferralForm from "@/app/components/referalPopUp";

export default function CommunityProject ( {
    params,
}: {
    params: { id: any; };
} )
{
    const columns = [
        // { name: "SNO.", uid: "sno" },
        { name: 'level', uid: 'level' },
        { name: "NAME", uid: "name" },
        { name: "STARS", uid: "stars" },
        { name: "FAMPOINTS", uid: "fampoints" },
        { name: "XPS", uid: "xps" },
        
    ];
    const { id } = params;
    const router = useRouter();
    // console.log(params)
    const dispatch = useDispatch<AppDispatch>();
    const { data: community, loading, error } = useSelector(
        ( state: RootState ) => state.community
    );
    const memberId = useSelector( ( state: RootState ) => state.login.user?._id );
    const currentQuests = useSelector( ( state: any ) => state.quest.currentQuests );
    const [ users, setUsers ] = useState<User[]>( [] );
    const questIds = community?.quests;
    const userData = community?.members;
    // console.log( community );
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

    const getUsers = useCallback( async () =>
    {
        if ( !userData ) return;
        const friendsIds = community?.members;
        try
        {
            const {
                data,
            } = await axios.post(
                `${ process.env.NEXT_PUBLIC_SERVER_URL }/user/friends`,
                { friendsIds }
            );
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

    const joinningCommunity = async ( e: any ) =>
    {
        // setLoadingCommunityId( e._id );
        try
        {
            const res = await dispatch(
                joinCommunity( { memberId, id: e._id } )
            ).unwrap();
            // console.log( res );
        } catch ( error )
        {
            console.log( "error in adding the community", "123", error );
        } finally
        {
            // console.log( "Tis is finally" );
            dispatch( fetchCommunity( id ) );
        }
    };

    if ( loading )
    {
        return (
            <div className='flex items-center justify-center min-h-screen bg-gray-100'>
                <div className='text-center'>
                    <div className='inline-block animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500'></div>
                    <p className='mt-4 text-xl font-semibold text-gray-700'>Loading...</p>
                </div>
            </div>
        );
    }

    if ( error )
    {
        return (
            <div className='flex items-center justify-center min-h-screen bg-gray-100'>
                <div className='text-center p-8 bg-white rounded-lg shadow-md'>
                    <svg
                        className='mx-auto h-16 w-16 text-red-500'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={ 2 }
                            d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                        />
                    </svg>
                    <h1 className='mt-4 text-2xl font-bold text-gray-800'>Error</h1>
                    <p className='mt-2 text-gray-600'>{ error }</p>
                    <button
                        onClick={ () => dispatch( fetchCommunity( id ) ) }
                        className='mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300'
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
            <div className='flex items-center justify-center min-h-screen bg-gray-100'>
                <div className='text-center p-8 bg-white rounded-lg shadow-md'>
                    <svg
                        className='mx-auto h-16 w-16 text-yellow-500'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={ 2 }
                            d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
                        />
                    </svg>
                    <h1 className='mt-4 text-2xl font-bold text-gray-800'>
                        No Community Found
                    </h1>
                    <p className='mt-2 text-gray-600'>
                        We couldn't find the community you're looking for.
                    </p>
                    <button
                        onClick={ () => window.history.back() }
                        className='mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300'
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='bg-black  min-h-screen lg:mx-16 '>
            <div className='container mx-auto px-4 py-8'>
                <div className=' rounded-lg shadow-lg overflow-hidden'>
                    <div className='flex'>
                        <div className='lg:w-48 lg:h-48 sm:h-40 sm:w-44 h-20 w-28  '>
                            <div className='box1 right-trapezium   bg-[#ffffff33]'>
                                <img
                                    src={ `${ community.logo }` }
                                    alt=''
                                    className='box2  rounded right-trapezium lg:w-48 lg:h-48 sm:h-40 sm:w-44 h-20 w-28  object-cover'
                                />
                            </div>
                        </div>

                        <div className='lg:h-48 sm:h-40 lg:w-full sm:w-full h-20 w-full '>
                            <div className='box1 community-clip bg-[#ffffff33]'>
                                <div
                                    className='h-full w-full box2 community-clip relative'
                                    style={ {
                                        background:
                                            "linear-gradient(90deg, #000000, #242066, #5A4B82, #7F6493, #000000)",
                                    } }
                                >
                                    <div className='absolute lg:bottom-5 lg:right-5 sm:bottom-5 sm:right-5  bottom-1 right-1 flex gap-2 place-items-center '>
                                        <div className='mr-8'>
                                            { " " }
                                            <h1 className='lg:text-lg sm:text-lg text-sm'>{ community.title }</h1>
                                        </div>
                                        <div className='flex  mr-2 items-center flex-col'>
                                            <span className='card-white-text lg:text-xl sm:text-xl text-sm'>
                                                { community.quests?.length || 0 }
                                            </span>
                                            <span className=' text-neutral-500 lg:text-medium sm:text-medium text-sm'>
                                                QUESTS
                                            </span>
                                        </div>

                                        <div className='flex  mr-2 items-center flex-col'>
                                            <span className='card-white-text lg:text-xl sm:text-xl text-sm'>
                                                { community.members?.length || 0 }
                                            </span>
                                            <span className=' text-neutral-500 lg:text-medium sm:text-medium text-sm'>
                                                FOLLOWERS
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className=' flex lg:flex-row sm:flex-row flex-col gap-4 lg:mt-4 sm:mt-0 mt-4'>
                        <div className='flex items-center   group-hover:bg-[#735dcf]'>
                            <div className='flex row gap-1'>
                                <div className='box1 right-trapezium w-[2rem] h-[2rem]  bg-[#ffffff33] '>
                                    <svg
                                        className='box2 right-trapezium lg:p-2 lg:w-10 lg:h-10 sm:w-6 sm:h-6 h-2 w-2  sm:p-1 '
                                        xmlns='http://www.w3.org/2000/svg'
                                        viewBox='0 0 17 17'
                                        fill='none'
                                    >
                                        <path
                                            d='M12.5736 2.125H14.7461L10.0003 7.52604L15.5834 14.875H11.2115L7.78815 10.4175L3.87035 14.875H1.69577L6.7724 9.09854L1.41669 2.125H5.89902L8.99444 6.19933L12.5736 2.125ZM11.8115 13.5802H13.0156L5.24452 3.35183H3.95252L11.8115 13.5802Z'
                                            fill='white'
                                        />
                                    </svg>
                                </div>
                                <div className='box1 left-right-trapezium w-[2rem] h-[2rem] px-2 bg-[#ffffff33]'>
                                    <svg
                                        className='box2 left-right-trapezium lg:p-2 lg:w-10 lg:h-10 sm:w-6 sm:h-6 sm:p-1 h-3 w-4 '
                                        xmlns='http://www.w3.org/2000/svg'
                                        viewBox='0 0 17 17'
                                        fill='none'
                                    >
                                        <path
                                            d='M13.6496 3.77537C12.7075 3.3362 11.6875 3.01745 10.625 2.83328C10.6157 2.83299 10.6064 2.83473 10.5978 2.83841C10.5893 2.84208 10.5816 2.84758 10.5754 2.85453C10.4479 3.08828 10.2991 3.39287 10.2 3.62662C9.07302 3.45662 7.92694 3.45662 6.79998 3.62662C6.70081 3.38578 6.55206 3.08828 6.41748 2.85453C6.4104 2.84037 6.38915 2.83328 6.3679 2.83328C5.3054 3.01745 4.29248 3.3362 3.34331 3.77537C3.33623 3.77537 3.32915 3.78245 3.32206 3.78953C1.3954 6.67245 0.864148 9.47745 1.12623 12.2541C1.12623 12.2683 1.13331 12.2825 1.14748 12.2895C2.42248 13.2245 3.6479 13.7912 4.85915 14.1666C4.8804 14.1737 4.90165 14.1666 4.90873 14.1525C5.19206 13.7629 5.44706 13.352 5.66665 12.92C5.68081 12.8916 5.66665 12.8633 5.63831 12.8562C5.23456 12.7004 4.85206 12.5162 4.47665 12.3037C4.44831 12.2895 4.44831 12.247 4.46956 12.2258C4.54748 12.1691 4.6254 12.1054 4.70331 12.0487C4.71748 12.0345 4.73873 12.0345 4.7529 12.0416C7.18956 13.1537 9.81748 13.1537 12.2258 12.0416C12.24 12.0345 12.2612 12.0345 12.2754 12.0487C12.3533 12.1125 12.4312 12.1691 12.5091 12.2329C12.5375 12.2541 12.5375 12.2966 12.5021 12.3108C12.1337 12.5304 11.7441 12.7075 11.3404 12.8633C11.3121 12.8704 11.305 12.9058 11.3121 12.927C11.5387 13.3591 11.7937 13.77 12.07 14.1595C12.0912 14.1666 12.1125 14.1737 12.1337 14.1666C13.3521 13.7912 14.5775 13.2245 15.8525 12.2895C15.8666 12.2825 15.8737 12.2683 15.8737 12.2541C16.1854 9.04537 15.3566 6.26162 13.6779 3.78953C13.6708 3.78245 13.6637 3.77537 13.6496 3.77537ZM6.03498 10.5612C5.3054 10.5612 4.69623 9.88828 4.69623 9.05953C4.69623 8.23078 5.29123 7.55787 6.03498 7.55787C6.78581 7.55787 7.38081 8.23787 7.37373 9.05953C7.37373 9.88828 6.77873 10.5612 6.03498 10.5612ZM10.9721 10.5612C10.2425 10.5612 9.63332 9.88828 9.63332 9.05953C9.63332 8.23078 10.2283 7.55787 10.9721 7.55787C11.7229 7.55787 12.3179 8.23787 12.3108 9.05953C12.3108 9.88828 11.7229 10.5612 10.9721 10.5612Z'
                                            fill='#8C71FF'
                                        />
                                    </svg>
                                </div>
                                <div className='box1 left-trapezium w-[2rem] h-[2rem] bg-[#ffffff33]'>
                                    <svg
                                        className='box2 left-trapezium lg:p-2 lg:w-10 lg:h-10 sm:w-6 sm:h-6 sm:p-1 h-3 w-4'
                                        xmlns='http://www.w3.org/2000/svg'
                                        viewBox='0 0 15 15'
                                        fill='none'
                                    >
                                        <g clipPath='url(#clip0_213_2492)'>
                                            <path
                                                fillRule='evenodd'
                                                clipRule='evenodd'
                                                d='M5.40967 0.295777C3.95975 0.717526 2.67072 1.56676 1.71099 2.73255C0.751252 3.89834 0.165424 5.32648 0.0300293 6.83042H3.4586C3.65736 4.54191 4.32089 2.31799 5.4086 0.294706L5.40967 0.295777ZM3.4586 8.16971H0.0300293C0.165141 9.6737 0.750718 11.102 1.71027 12.268C2.66981 13.4339 3.95872 14.2834 5.4086 14.7054C4.32089 12.6821 3.65736 10.4582 3.4586 8.16971ZM7.12717 14.9915C5.82731 12.9316 5.03081 10.5946 4.80217 8.16971H10.1968C9.96817 10.5946 9.17167 12.9316 7.87182 14.9915C7.62375 15.0035 7.37524 15.0035 7.12717 14.9915ZM9.59146 14.7043C11.0412 14.2824 12.33 13.4331 13.2895 12.2673C14.249 11.1016 14.8347 9.67351 14.97 8.16971H11.5415C11.3427 10.4582 10.6792 12.6821 9.59146 14.7054V14.7043ZM11.5415 6.83042H14.97C14.8349 5.32643 14.2493 3.89815 13.2898 2.73216C12.3302 1.56618 11.0413 0.716705 9.59146 0.294706C10.6792 2.31798 11.3427 4.5419 11.5415 6.83042ZM7.12717 0.00863426C7.37559 -0.00352913 7.62446 -0.00352913 7.87289 0.00863426C9.17237 2.06857 9.9685 4.40557 10.1968 6.83042H4.80324C5.03574 4.39078 5.83396 2.05185 7.12717 0.00863426Z'
                                                fill='#FA00FF'
                                            />
                                        </g>
                                        <defs>
                                            <clipPath id='clip0_213_2492'>
                                                <rect width='15' height='15' fill='white' />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className='flex gap-2 lg:mt-0 sm:mt-4'>
                            <h1 className='text-neutral-200'>BIO:</h1>
                            <p className='text-sm text-neutral-500'>
                                Leading lending market on zkSync, Manta Network, Blast & Linea.
                                Audited by Halborn Security, Immunefi and Mundus Security.
                                Incubated by MahaDAO. - Earn Zero Points Complete below tasks to
                                earn Zero Points. Jump in daily to earn more!
                            </p>
                        </div>
                    </div>

                    {/* <div className="p-6">
            <p className="text-lg text-white  mb-6">{community.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                  Ecosystems
                </h2>
                <div className="flex flex-wrap gap-2">
                  {community.ecosystem.map((eco, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold"
                    >
                      {eco}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex gap-2">
                 
                  <div>
                    <h2 className="text-2xl font-medium text-blue-600 mb-4">
                      Community Stats
                    </h2>
                  </div>
                </div>
                <div className="bg-blue-50 p-2 rounded-lg w-48 flex justify-center">
                  <div className="flex items-center ">
                    <p className="text-2xl font-bold text-blue-800">
                      {community.quests?.length || 0}
                    </p>
                    <p className="text-gray-600 mx-3">Active Quests</p>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
                </div>

                <div className='mai div flex  lg:flex-row sm:flex-col flex-col mt-16 gap-24 justify-end '>
                    <section className='w-full flex flex-col justify-center items-center'>
                        <div className='flex flex-row justify-center my-2 gap-3 text-pink-950 lg:text-5xl'>
                            - - - - - - - - - - -
                        </div>

                        <div className='my-4 flex items-center gap-2 justify-center'>
                            <div className=''>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='15'
                                    height='11'
                                    viewBox='0 0 15 11'
                                    fill='none'
                                >
                                    <path
                                        d='M0.5 1H5.98652L14.5 10'
                                        stroke='#FA00FF'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                    />
                                    <path
                                        d='M5.5 5L10.5 10'
                                        stroke='#FA00FF'
                                        strokeLinecap='round'
                                    />
                                </svg>
                            </div>
                            <div className='listOfFriends'>Leaderboard</div>
                        </div>
                        <div className='w-[90%] lg:w-[80%] flex userTable justify-center items-center bg-[#040404] '>
                            <UserTable<User> data={ users } columns={ columns } rowsPerPage={ 5 } />
                        </div>
                    </section>

                    <div className='basis-[50%]'>
                        <div className='border border-neutral-600  p-5'>
                            <div className='lg:px-6 sm:px-6 px-2 py-2  flex justify-between items-center'>
                                <div>
                                    <p className='text-neutral-500 lg:text-lg sm:text-lg text-sm'>
                                        Count down
                                    </p>
                                </div>
                                <div className='text-neutral-500 text-lg lg:block sm:block hidden'>
                                    |
                                </div>
                                <div className='flex items-center gap-4'>
                                    <div>
                                        <p className='text-neutral-500'>End in:</p>
                                    </div>

                                    <div className='flex items-center space-x-2 sm:space-x-2  group-hover:bg-[#735dcf]'>
                                        <div className='flex row gap-2'>
                                            <div className='box1 right-trapezium w-[2rem] h-[2rem] bg-[#ffffff33]'>
                                                <p className='box2 right-trapezium px-4 py-3'>1</p>
                                            </div>
                                            <div className='box1 left-right-trapezium w-[2rem] h-[2rem] px-2 bg-[#ffffff33]'>
                                                <p className='box2 left-right-trapezium px-4 py-3'>2</p>
                                            </div>
                                            <div className='box1 left-trapezium w-[2rem] h-[2rem] bg-[#ffffff33]'>
                                                <p className='box2 left-trapezium px-4 py-3'>3</p>
                                            </div>
                                            <div>
                                                <p className='px-4 py-3 border border-neutral-600  '>
                                                    4
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='mt-10 border border-neutral-600 lg:p-8 sm:p-8 p-5 '>
                            <div className='flex gap-10'>
                                <div className='lg:h-36 lg:w-48 sm:h-36 sm:w-48  h-24 w-40 bg-[#121212]'></div>

                                <div className='flex flex-col gap-5 w-full'>
                                    <div className='flex items-center gap-2'>
                                        <h1 className='text-neutral-500'>XP</h1>
                                        <div className='relative w-full h-1 bg-[#212121]'>
                                            <div
                                                className='bg-[#cb03cf] h-1 absolute'
                                                style={ { width: "40%" } }
                                            ></div>
                                            <div className='text-xs text-[#cb03cf] absolute left-0 top-2'>
                                                { 40 } XPs
                                            </div>
                                        </div>
                                    </div>

                                    <div className='flex items-center justify-between'>
                                        <h1 className='text-neutral-500'>Token:</h1>
                                        <div className='flex items-center gap-1'>
                                            <div className='w-3 h-3 bg-gray-600 rounded-full'></div>
                                            <div className='text-white'>
                                                USDC <span className='ml-2'>2000</span>
                                            </div>
                                        </div>
                                    </div>

                                    { ( memberId && !userData?.includes( memberId ) ) ?<> <button className="bg-[#6e00fa] text-white lg:py-3 lg:px-4 sm:py-3 py-1 rounded-md lg:mt-2" onClick={ () => { joinningCommunity( community ); } }
                                    >
                                        Join the community
                                    </button>               
                                       <ReferralForm memberId={ memberId } id={ community._id } />
                                    </> : ( memberId && userData?.includes( memberId ) ) ? <button className="bg-[#6e00fa] text-white lg:py-3 lg:px-4 sm:py-3 py-1 rounded-md lg:mt-2" 
                                    >
                                        Leave the community
                                    </button> : <button className="bg-[#6e00fa] text-white lg:py-3 lg:px-4 sm:py-3 py-1 rounded-md lg:mt-2" onClick={ () => router.push( "/login" ) } >
                                        Sign in / up
                                    </button> }


                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {currentQuests?.map((quest: any, index: number) => (
            <div
              key={index}
              onClick={(e) => {
                e.preventDefault();
                window.location.href = `/user/quest/${quest._id}`;
              }}
            >
              <div className=" bg-[#121212] border   dark:border-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="bg-blue-100 h-40 flex items-center justify-center">
                  <span className="text-6xl text-blue-500">🏆</span>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-neutral-300 mb-2">
                    {quest.title}
                  </h3>
                  <p className="text-neutral-300">
                    Click to view quest details
                  </p>
                </div>
              </div>
            </div>
            // </Link>
          ))}
        </div> */}

                    <div className='p-2 edu  mt-10  grid lg:gap-10 sm:gap-10 gap-4  mx-8  lg:mx-0 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'>
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
                                className=''
                            >
                                <div>
                                    <div className='box1 education-clip bg-red-700 '>
                                        <div className='education-clip box2 border h-28 w-48 bg-red-700/10 flex justify-center items-center p-4'>
                                            <div>
                                                <img
                                                    src={quest.logo}
                                                    alt=''
                                                    className='h-16 w-36 object-cover'
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className='mt-2 flex gap-3 justify-center'>
                                        <div>
                                            <img
                                                src={ `${ community.logo }` }
                                                alt=''
                                                className='h-6 w-6 rounded-full object-cover'
                                            />
                                        </div>
                                        <div>
                                            <p className='text-small text-slate-300'>{ quest.title }</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) ) }
                    </div>
                </div>
            </div>
        </div>
    );
}
