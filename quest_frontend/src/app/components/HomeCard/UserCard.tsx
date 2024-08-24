
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import { useRouter } from "next/navigation"; 
export interface User
{
  id: number;
  firstName: string;
  lastName: string;
  profileImage: string;
  rank: number;
  icons: string[];
}

const UserCard = () => {
  const [ data, setData ] = useState( [] );
  const [loading,setLoading] = useState(false)
  const router = useRouter();
  const getAllUser = async () => {
    try {
      setLoading( true );
      const response = await axios.get(
        `${ process.env.NEXT_PUBLIC_SERVER_URL }/user/`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // console.log("respinse in gettitng user:-",response);
      setData( response.data );
    } catch ( error )
    {
      console.log( error );
    } finally
    {
      setLoading( false );
    }
  };
  console.log( "Users :-", data );

  useEffect( () =>
  {
    getAllUser();
  }, [] );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <button className="slick-prev slick-arrow" aria-label="Previous" type="button">Previous</button>,
    nextArrow: <button className="slick-next slick-arrow" aria-label="Next" type="button">Next</button>,
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
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  const renderUserCard = ( user: any ) => (
    <div
      key={ user._id }
      className="main outer-home border border-gray-700 bg-black p-4 rounded shadow-lg group cursor-pointer"
      onClick={()=> router.push(`/user/profile/${user._id}`)}
    >
      <div className="rounded-md flex">
        <div className="flex-col justify-center">
          <div className="image-container md:h-20 md:w-20 w-14 h-14 items-center flex">
            {user?.image && <img src={ user?.image } alt="" className="styled-image" />}
            {user?.domain?.image && <img src={ user?.domain?.image } alt="" className="styled-image" />}
          </div>
          <div className="bg_Div_Down-h h-[2rem] mt-2 bg-[#281a28]" />
        </div>

        <div className="flex-1 md:ml-4 ml-2">
          <div className="flex items-center md:justify-between justify-around">
            <div>
              <div className="font-bold" style={ { letterSpacing: "5px" } }>
                { user?.displayName }
                {user?.domain?.domainAddress}
              </div>

            </div>
            <div className="text-purple-500  home-rank font-bold text-lg">
              #{ user.rank }
            </div>
          </div>
          <hr className="border-gray-700 my-2 mt-5" />
          <div className="z-10 flex items-center space-x-3 mt-6"  >

            { [ "🍎", "⭐", "⭐" ].map( ( icon, index ) => (
              <div
                key={ index }
                className="bg-[#8C71FF] home-inner-bg clip-trapezium-top-right lg:px-4 sm:px-2 px-2"
              >
                <span role="img" aria-label="Icon" className="">
                  { icon }
                </span>
              </div>
            ) ) }
          </div>
        </div>
      </div>

      <div className="text-center w-full lg:block  hidden">
        <h1 className="text-white/30 " style={ { letterSpacing: "10px" } }>
          { " " }
          . . . . . . . . . . . . .{ " " }
        </h1>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto ">
      <div className="flex items-center gap-1 mt-10 mb-8">
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
          <p>User Profile</p>
        </div>
      </div>

      <Slider { ...settings }>
        { data?.map( ( user: any ,index: number) => (
          <div key={ index }>{ renderUserCard( user ) }</div>
        ) ) }
      </Slider>

    </div>
  );
};

export default UserCard;;