"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { BallTriangle } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchUserData } from "@/redux/reducer/authSlice";
import { Chip } from "@nextui-org/react";
import type { Friend } from "../data";
import UserTable from "@/app/components/table/userTable";
import axios from "axios";
import { notify } from "@/utils/notify";
import Image from "next/image";

type BadgesData = {
  id: number;
  title: string;
  imageUrl: string;
};
const BadgesData: BadgesData[] = [
  {
    id: 1,
    title: "Badges earn",
    imageUrl:
      "https://i.pinimg.com/originals/88/ea/0a/88ea0a1c3c448867bb7133692c5c6682.png",
  },
  {
    id: 2,
    title: "Badges earn",
    imageUrl:
      "https://antonia.lv/images/izsole79/staba-bataljona-zetons_511_xl.jpg",
  },
  {
    id: 3,
    title: "Badges earn",
    imageUrl:
      "https://i.pinimg.com/originals/88/ea/0a/88ea0a1c3c448867bb7133692c5c6682.png",
  },
  {
    id: 4,
    title: "Badges earn",
    imageUrl:
      "https://antonia.lv/images/izsole79/staba-bataljona-zetons_511_xl.jpg",
  },
  {
    id: 5,
    title: "Badges earn",
    imageUrl:
      "https://i.pinimg.com/originals/88/ea/0a/88ea0a1c3c448867bb7133692c5c6682.png",
  },
  {
    id: 6,
    title: "Badges earn",
    imageUrl:
      "https://antonia.lv/images/izsole79/staba-bataljona-zetons_511_xl.jpg",
  },
];

const columns = [
  // { name: "SNO.", uid: "sno" },
  { name: "NAME", uid: "name" },
  { name: "STARS", uid: "stars" },
  { name: "FAMPOINTS", uid: "fampoints" },
  { name: "XPS", uid: "xps" },
  { name: "level", uid: "level" },
];

const UserProfile = ( { params }: { params: { id: string; }; } ) =>
{
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [ isClient, setIsClient ] = useState( false );
  const [ isFollowed, setIsFollowed ] = useState<Boolean>( false );
  const [ earned, setEarned ] = useState<number | null>( null );
  const [ userData, setUserData ] = useState<any>( null );
  const [ allFriends, setAllFriends ] = useState<any>( [] );

  const user = useSelector( ( state: RootState ) => state.login.user );
  const { id: userId } = useParams();

  const handleEarnRewardsClicks = useCallback( () =>
  {
    setEarned( prev => prev === null ? 5000 : null );
  }, [] );

  const checkFollow = useCallback( () =>
  {
    if ( user?.following && userId )
    {
      setIsFollowed( user.following.includes( userId as string ) );
    }
  }, [ user, userId ] );

  const getUserProfile = useCallback( async () =>
  {
    if ( !userId )
    {
      console.log( "User id not found", userId );
      return;
    }
    try
    {
      const { data } = await axios.get( `${ process.env.NEXT_PUBLIC_SERVER_URL }/user/${ userId }` );
      setUserData( data );
      return data;
    } catch ( error )
    {
      console.error( "Error fetching user profile:", error );
    }
  }, [ userId ] );

  const getFriendIds = useCallback( ( user: any ) =>
  {
    const allConnections = [ ...( user?.followers || [] ), ...( user?.following || [] ) ];
    return Array.from( new Set( allConnections ) );
  }, [] );

  const getFriends = useCallback( async ( user: any ) =>
  {
    const friendsIds = getFriendIds( user );
    try
    {
      const { data } = await axios.post( `${ process.env.NEXT_PUBLIC_SERVER_URL }/user/friends`, { friendsIds } );
      setAllFriends( data.friends );
    } catch ( error )
    {
      console.error( "Error fetching friends:", error );
    }
  }, [ getFriendIds ] );

  const handleFollowToggle = useCallback( async () =>
  {
    if ( !user?._id || !userId ) return;
    const endpoint = isFollowed ? 'unfollow' : 'follow';
    const payload = isFollowed ? { unfollowId: userId, userId: user._id } : { followId: userId, userId: user._id };
    try
    {
      await axios.post( `${ process.env.NEXT_PUBLIC_SERVER_URL }/user/${ endpoint }`, payload, {
        headers: { "Content-Type": "application/json" },
      } );
      setIsFollowed( !isFollowed );
      const updatedUserData = await getUserProfile();
      if ( updatedUserData )
      {
        getFriends( updatedUserData );
      }
    } catch ( error )
    {
      console.error( `Error ${ isFollowed ? 'unfollowing' : 'following' } the user:`, error );
    }
  }, [ user, userId, isFollowed, getUserProfile, getFriends ] );

  useEffect( () =>
  {
    setIsClient( true );
    dispatch( fetchUserData() );
  }, [ dispatch ] );

  useEffect( () =>
  {
    if ( userId )
    {
      getUserProfile().then( data =>
      {
        if ( data )
        {
          getFriends( data );
        }
      } );
    }
  }, [ userId, getUserProfile, getFriends ] );

  useEffect( () =>
  {
    checkFollow();
  }, [ checkFollow ] );

  if ( !isClient )
    return (
      <div className="flex justify-center items-center">
        <BallTriangle />
      </div>
    );

  return (
    <>
      <div className="min-h-screen mb-8">
        <div className="w-[85%] mx-auto">
          {/* user info */ }
          <section className="mt-20">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between lg:mt-20 mx-4 lg:mx-10">
              {/* user info */ }
              <div className="lg:w-1/2">
                <div className="flex flex-col lg:flex-row items-center ">
                  <div className="lg:w-2/5 flex flex-col justify-center items-center">
                    <div className="w-[8rem] h-[8rem] flex justify-center items-center">
                      { userData ? (
                        <img
                          src={ userData.image }
                          alt="avatar photo"

                          className="bottom-trapezium mt-8"
                        />
                      ) : (
                        <img
                          src="https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg?size=338&ext=jpg&ga=GA1.1.1141335507.1719532800&semt=ais_user"
                          alt="avatar photo"

                          className="bottom-trapezium mt-8"
                        />
                      ) }
                    </div>
                  </div>
                  <div className="lg:w-3/5 flex lg:justify-start  mt-6 lg:mt-1">
                    <div className="flex flex-col justify-between lg:items-start items-center">
                      <div className="flex justify-start gap-5 row">
                        <span className="username">
                          { userData?.displayName }
                        </span>
                        <span className="user-rank">
                          {/* Follow */ }#{ userData?.rank }
                        </span>
                        <span>
                          { isFollowed ? (
                            <button
                              onClick={ handleFollowToggle }
                              className="px-4 py-2 bg-[#FA00FF] rounded-full active:bg-[#711673]"
                            >
                              Unfollow
                            </button>
                          ) : (
                            <button
                              onClick={ handleFollowToggle }
                              className="px-4 py-2 bg-[#FA00FF] rounded-full active:bg-[#711673]"
                            >
                              Follow
                            </button>
                          ) }
                        </span>
                      </div>
                      <div className="flex row py-4 px-2 gap-1">
                        <div className="box1 right-trapezium w-[2rem] h-[2rem] bg-[#ffffff33]">
                          <svg
                            className="box2 right-trapezium p-2"
                            xmlns="http://www.w3.org/2000/svg"
                            width="17"
                            height="17"
                            viewBox="0 0 17 17"
                            fill="none"
                          >
                            <path
                              d="M12.5736 2.125H14.7461L10.0003 7.52604L15.5834 14.875H11.2115L7.78815 10.4175L3.87035 14.875H1.69577L6.7724 9.09854L1.41669 2.125H5.89902L8.99444 6.19933L12.5736 2.125ZM11.8115 13.5802H13.0156L5.24452 3.35183H3.95252L11.8115 13.5802Z"
                              fill="white"
                            />
                          </svg>
                        </div>
                        <div className="box1 left-right-trapezium w-[2rem] h-[2rem] px-2 bg-[#ffffff33]">
                          <svg
                            className="box2 left-right-trapezium p-2"
                            xmlns="http://www.w3.org/2000/svg"
                            width="17"
                            height="17"
                            viewBox="0 0 17 17"
                            fill="none"
                          >
                            <path
                              d="M13.6496 3.77537C12.7075 3.3362 11.6875 3.01745 10.625 2.83328C10.6157 2.83299 10.6064 2.83473 10.5978 2.83841C10.5893 2.84208 10.5816 2.84758 10.5754 2.85453C10.4479 3.08828 10.2991 3.39287 10.2 3.62662C9.07302 3.45662 7.92694 3.45662 6.79998 3.62662C6.70081 3.38578 6.55206 3.08828 6.41748 2.85453C6.4104 2.84037 6.38915 2.83328 6.3679 2.83328C5.3054 3.01745 4.29248 3.3362 3.34331 3.77537C3.33623 3.77537 3.32915 3.78245 3.32206 3.78953C1.3954 6.67245 0.864148 9.47745 1.12623 12.2541C1.12623 12.2683 1.13331 12.2825 1.14748 12.2895C2.42248 13.2245 3.6479 13.7912 4.85915 14.1666C4.8804 14.1737 4.90165 14.1666 4.90873 14.1525C5.19206 13.7629 5.44706 13.352 5.66665 12.92C5.68081 12.8916 5.66665 12.8633 5.63831 12.8562C5.23456 12.7004 4.85206 12.5162 4.47665 12.3037C4.44831 12.2895 4.44831 12.247 4.46956 12.2258C4.54748 12.1691 4.6254 12.1054 4.70331 12.0487C4.71748 12.0345 4.73873 12.0345 4.7529 12.0416C7.18956 13.1537 9.81748 13.1537 12.2258 12.0416C12.24 12.0345 12.2612 12.0345 12.2754 12.0487C12.3533 12.1125 12.4312 12.1691 12.5091 12.2329C12.5375 12.2541 12.5375 12.2966 12.5021 12.3108C12.1337 12.5304 11.7441 12.7075 11.3404 12.8633C11.3121 12.8704 11.305 12.9058 11.3121 12.927C11.5387 13.3591 11.7937 13.77 12.07 14.1595C12.0912 14.1666 12.1125 14.1737 12.1337 14.1666C13.3521 13.7912 14.5775 13.2245 15.8525 12.2895C15.8666 12.2825 15.8737 12.2683 15.8737 12.2541C16.1854 9.04537 15.3566 6.26162 13.6779 3.78953C13.6708 3.78245 13.6637 3.77537 13.6496 3.77537ZM6.03498 10.5612C5.3054 10.5612 4.69623 9.88828 4.69623 9.05953C4.69623 8.23078 5.29123 7.55787 6.03498 7.55787C6.78581 7.55787 7.38081 8.23787 7.37373 9.05953C7.37373 9.88828 6.77873 10.5612 6.03498 10.5612ZM10.9721 10.5612C10.2425 10.5612 9.63332 9.88828 9.63332 9.05953C9.63332 8.23078 10.2283 7.55787 10.9721 7.55787C11.7229 7.55787 12.3179 8.23787 12.3108 9.05953C12.3108 9.88828 11.7229 10.5612 10.9721 10.5612Z"
                              fill="#8C71FF"
                            />
                          </svg>
                        </div>
                        <div className="box1 left-trapezium w-[2rem] h-[2rem] bg-[#ffffff33]">
                          <svg
                            className="box2 left-trapezium p-2"
                            xmlns="http://www.w3.org/2000/svg"
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            fill="none"
                          >
                            <g clipPath="url(#clip0_213_2492)">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M5.40967 0.295777C3.95975 0.717526 2.67072 1.56676 1.71099 2.73255C0.751252 3.89834 0.165424 5.32648 0.0300293 6.83042H3.4586C3.65736 4.54191 4.32089 2.31799 5.4086 0.294706L5.40967 0.295777ZM3.4586 8.16971H0.0300293C0.165141 9.6737 0.750718 11.102 1.71027 12.268C2.66981 13.4339 3.95872 14.2834 5.4086 14.7054C4.32089 12.6821 3.65736 10.4582 3.4586 8.16971ZM7.12717 14.9915C5.82731 12.9316 5.03081 10.5946 4.80217 8.16971H10.1968C9.96817 10.5946 9.17167 12.9316 7.87182 14.9915C7.62375 15.0035 7.37524 15.0035 7.12717 14.9915ZM9.59146 14.7043C11.0412 14.2824 12.33 13.4331 13.2895 12.2673C14.249 11.1016 14.8347 9.67351 14.97 8.16971H11.5415C11.3427 10.4582 10.6792 12.6821 9.59146 14.7054V14.7043ZM11.5415 6.83042H14.97C14.8349 5.32643 14.2493 3.89815 13.2898 2.73216C12.3302 1.56618 11.0413 0.716705 9.59146 0.294706C10.6792 2.31798 11.3427 4.5419 11.5415 6.83042ZM7.12717 0.00863426C7.37559 -0.00352913 7.62446 -0.00352913 7.87289 0.00863426C9.17237 2.06857 9.9685 4.40557 10.1968 6.83042H4.80324C5.03574 4.39078 5.83396 2.05185 7.12717 0.00863426Z"
                                fill="#FA00FF"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_213_2492">
                                <rect width="15" height="15" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row items-center mt-4">
                  <div className="lg:w-2/5">
                    <div className="">
                      <div className="flex row gap-3">
                        <button className="px-4 font-bold py-2 rounded-full text-center hover:text-[#FA00FF] ">
                          { userData?.following?.length } following
                        </button>
                        <button className="px-4 font-bold py-2 rounded-full text-center hover:text-[#FA00FF] ">
                          { userData?.followers?.length } followers
                        </button>
                      </div>

                      <div className="flex col gap-5 justify-center items-center">
                        <Chip
                          onClick={ handleEarnRewardsClicks }
                          color="warning"
                          variant="bordered"
                          className="cursor-pointer px-4 py-2 mt-3"
                        >
                          { userData?.rewards?.xp } pts
                        </Chip>

                        {/* <Chip
                          onClick={handleEarnRewardsClick}
                          variant="solid"
                          className="cursor-pointer px-4 py-2 mt-3"
                          color="warning"
                        >
                          Earn rewards
                        </Chip> */}
                      </div>
                    </div>
                  </div>
                  <div></div>
                </div>
              </div>
              {/* badges */ }
              <div className="lg:w-1/2 ">
                <div className="flex flex-col lg:justify-start justify-center lg:items-start items-center">
                  <div className="badgesBox w-full min-h-32 mt-5 lg:mt-0">
                    <div className="w-full min-h-32 innerbox2 ">
                      <svg className="top-0 left-0 svg1" style={ { strokeWidth: "1px", stroke: "#FA00FF" } } xmlns="http://www.w3.org/2000/svg" width="5" height="4" viewBox="0 0 5 4" fill="none">
                        <path d="M4.5 3.5L1 3.5L1 4.17371e-08" stroke="#FA00FF" />
                      </svg>
                      <svg className="top-0 left-0 svg2" style={ { strokeWidth: "1px", stroke: "#FA00FF" } } xmlns="http://www.w3.org/2000/svg" width="4" height="5" viewBox="0 0 4 5" fill="none">
                        <path d="M0 4L3.5 4L3.5 0.5" stroke="#FA00FF" />
                      </svg>
                      <div className="flex justify-start items-center">

                        { userData?.badges?.length ? (
                        <div className="flex flex-wrap lg:justify-start justify-center items-center p-2">
                          { userData.badges.map( ( data:any ) => (
                            <div
                              key={ data?.id }
                              className="p-2 rounded-md flex items-center text-white flex-col justify-center hover:text-white hover:bg-gray-500 cursor-pointer"
                            >
                              <div className="w-[2rem] h-[2rem] bottom-trapezium">
                                <img
                                  src={ data?.imageUrl || 'https://i.pinimg.com/originals/88/ea/0a/88ea0a1c3c448867bb7133692c5c6682.png' }
                                  alt="badge photo"
                                  className="w-full h-full bg-cover object-cover"
                                />
                              </div>
                              <h1 className="font-medium">{ data?.name }</h1>
                            </div>
                          ) ) }
                        </div>
                      ) : (
                        <div className="flex justify-center items-center p-4 hover:cursor-pointer" onClick={()=>router.push('/allcommunity')} >
                          <div className=" rounded-lg p-6 text-center shadow-md">
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                              />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-300">No badges yet</h3>
                          </div>
                        </div>
                      ) }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* friends  */ }
          <section className="mt-32">
            <div className="my-4 flex items-center gap-2 justify-center">
              <div className="">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="11"
                  viewBox="0 0 15 11"
                  fill="none"
                >
                  <path
                    d="M0.5 1H5.98652L14.5 10"
                    stroke="#FA00FF"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.5 5L10.5 10"
                    stroke="#FA00FF"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="listOfFriends">List of Friends</div>
            </div>
            <div className="friendTable">
              <UserTable<Friend> data={ allFriends } columns={ columns } rowsPerPage={ 5 } />
            </div>
          </section>
          <section></section>
        </div>
      </div>
    </>
  );
};
export default UserProfile;
