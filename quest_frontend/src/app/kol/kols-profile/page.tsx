"use client";
import { RootState } from "@/redux/store";
import React, { useState, useEffect } from "react";
import { BallTriangle } from "react-loader-spinner";
import { useSelector } from "react-redux";
import ModalForm from "@/app/components/ModalForm";
import axios from "axios";
import { FaBolt, FaTwitter, FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Community
{
  _id: string;
  title: string;
  description: string;
  logo: string;
  members: any[];
  quests: any[];

}

type Props = {};

const KolsProfile = ( props: Props ) =>
{
  const router = useRouter();
  const [ isClient, setIsClient ] = useState( false );
  const [ communities, setCommunities ] = useState<Community[]>( [] );

  const fetchCommunities = async ( ids: string[] ) =>
  {
    try
    {
      const response = await axios.post( `${ process.env.NEXT_PUBLIC_SERVER_URL }/community/getByIds`, {
        communityIds: ids,
      } );
      setCommunities( response.data.communities );
      // console.log( "community data", response.data );
    } catch ( error )
    {
      console.error( 'Failed to fetch communities:', error );
    }
  };

  const user = useSelector( ( state: RootState ) => state.login.user );

  const handleDiscord=()=>{
    window.location.href=`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/discord`
  }

 
  useEffect( () =>
  {
    setIsClient( true );
    if ( user && user.community )
    {
      fetchCommunities( user.community );
    }
  }, [ user ] );

  if ( !user )
  {
    return (
      <div className="flex justify-center items-center">
        <BallTriangle />
      </div>
    );
  }

  if ( !isClient )
  {
    return (
      <div className="flex justify-center items-center">
        <BallTriangle />
      </div>
    );
  }

  return (
    <>
      { user && user.discordInfo && (
        <div className="min-h-screen bg-[#121212]">
          <div className="lg:mx-10 mx-4 py-10">
            <div className="flex flex-col sm:flex-row  lg:flex-row gap-6">
              <div className="lg:basis-[30%] sm:basis-[40%] flex flex-col items-center ">
                <div className="flex">
                  <img
                    src={ user.image }
                    width={ 150 }
                    height={ 150 }
                    alt={ user.nickname }
                    className="rounded-full object-cover"
                  />
                </div>
                <div className="mt-2">
                  <ModalForm />
                </div>
                <div className="flex flex-col lg:flex-row justify-center mt-6 gap-6">
                  <div>
                    <p className="font-semibold lg:text-lg text-2xl">{ user.displayName }</p>
                    <p className="hover:text-sky-600 mt-4 font-semibold">123 following</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="px-10 py-1 lg:px-6 lg:py-1 rounded-xl font-semibold bg-blue-500">
                      Rank
                    </span>
                    <p className=" hover:text-sky-600 mt-3 text-xl lg:text-medium font-semibold">followers</p>
                  </div>
                </div>
                <div>
                  <button className="bg-blue-500 rounded-2xl px-6 py-1 mt-6">
                    follow
                  </button>
                </div>
              </div>
              <div className="lg:basis-[70%] sm:basis-[60%]">
                <div className="bg-[#1e1e1e] shadow rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-4">About Me</h2>
                  <p className="text-gray-300">{ user.bio }</p>
                </div>
                <h2 className="text-xl font-bold mt-6 mb-4">My Communities</h2>
                <div className="grid gap-4 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 pt-5">
                  { communities.map( ( community, index ) => (

                    <div className="" key={ index }
                      onClick={ () => router.push( `/kol/community-project/${ community?._id }` ) }
                    >
                      <div className="outer-div relative flex gap-8 hover:bg-[#8c71ff] hover:text-[#111111] border-[#282828] border p-1 flex-col m-auto justify-center w-[22rem] sm:w-full">
                        <div className="flex flex-row text-xl items-center justify-around m-auto">
                          <div className="p-1">
                            <div className="image-container h-[5rem] w-[5rem] items-center flex">
                              <img
                                src={ community.logo }
                                alt=""
                                className="styled-image"

                              />
                            </div>
                            <div className="bg_Div_Down h-[2rem] mt-2 bg-gray-800" />
                          </div>
                          <div className="flex flex-col">
                            <div className="flex  m-1 flex-col items-center">
                              <div className="flex bg_eco_div border-b-4 border-[#8c71ff] pt-6 bg-[#1d1a28] flex-row items-center justify-between w-full m-auto">
                                <div className="text-lg ml-3">
                                  { community.title }
                                </div>
                                <div className="text-xs flex flex-row rounded-lg pl-6">
                                  <div className="flex m-2 items-center flex-col">
                                    <span>{ community.quests.length }</span>
                                    <span>Quests</span>
                                  </div>
                                  <div className="flex m-2 items-center flex-col">
                                    <span>{ community.members.length }</span>
                                    <span>Followers</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-row justify-end gap-x-1">
                              <div className="eco_box w-5 h-5 bg-[#8c71ff]" />
                              <div className="eco_box w-5 h-5 bg-[#8c71ff]" />
                              <div className="eco_box w-5 h-5 bg-[#8c71ff]" />
                            </div>
                          </div>
                        </div>


                        <div className="absolute -top-1 -right-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="6"
                            height="6"
                            viewBox="0 0 4 4"
                            fill="none"
                          >
                            <path d="M0.5 0V3.5H4" stroke="white" />
                          </svg>
                        </div>

                        <div>
                          <div className="flex flex-row text-sm m-1 justify-between ">
                            <span className="flex descText">Desc:</span>
                            <span className="text-gray-600 descdata text-wrap">
                              { community.description }
                            </span>
                          </div>
                        </div>

                      </div>
                    </div>

                  ) ) }

                </div>
              </div>
            </div>
          </div>
        </div>
      ) }
    </>
  );
};

export default KolsProfile;
