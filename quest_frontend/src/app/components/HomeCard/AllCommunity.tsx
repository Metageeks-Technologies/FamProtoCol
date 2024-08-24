import React, { useState, useEffect } from "react";
import CommunityCard from "@/app/components/HomeCard/CommunityCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import Slider from "react-slick";
import { fetchAllCommunities } from "@/redux/reducer/communitySlice";
import { getCommunitySuccess } from "@/redux/reducer/adminCommunitySlice";
import { useRouter } from "next/navigation";
import CommunityCardSkeleton from "@/app/components/HomeCard/CommunityCardSkeleton";

const AllCommunity=()=>{
    const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const data = useSelector( ( state: RootState ) => state.login.user );
  const {allCommunities,loading} = useSelector( ( state: any ) => state.community );

  // console.log( Communities );
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1050,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 710,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  useEffect( () =>
  {
    dispatch( fetchAllCommunities() );
    dispatch (getCommunitySuccess());
  }, [] );
    return(
        <>
             <div className="mx-5 md:mx-2 lg:mt-10 md:mt-5 mt-5">
        <div className="flex items-center gap-1 mt-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="11"
            viewBox="0 0 16 11"
            fill="none"
          >
            <path
              d="M1 1H6.48652L15 10"
              stroke="#FA00FF"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M6 5L11 10" stroke="#FA00FF" strokeLinecap="round" />
          </svg>
          <div>
            <p>Communities</p>
          </div>
          <div className="flex-grow relative">
            <svg
              className="w-full"
              xmlns="http://www.w3.org/2000/svg"
              height="2"
              viewBox="0 0 952 2"
              fill="none"
            >
              <path
                opacity="0.8"
                d="M951 1L0.999969 1"
                stroke="url(#paint0_linear_53_3430)"
                strokeLinecap="round"
                strokeDasharray="13 13"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_53_3430"
                  x1="951"
                  y1="0.5"
                  x2="1"
                  y2="0.5"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#8C71FF" stopOpacity="0" />
                  <stop offset="1" stopColor="#FA00FF" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 hover:cursor-pointer">
              <button className="bg-transparent border-none cursor-pointer" onClick={()=>router.push('/allcommunity')}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 16 16 12 12 8" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              </button>
              <span className="invisible group-hover:visible absolute top-1/2 left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
                View all communities
              </span>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <Slider { ...settings }>
            { loading
              ? Array( 6 ).fill( 0 ).map( ( _, index ) => <CommunityCardSkeleton key={ index } /> )
              : allCommunities?.map( ( data: any, index: number ) => (
                <CommunityCard key={ index } data={ data } />
              ) )
            }
            
            {/* { communities?.map( ( data: any, index: number ) => (
              <CommunityCard key={ index } data={ data } />
            ) ) } */}
          </Slider>
        </div>
      </div>
        </>
    )
}

export default AllCommunity;