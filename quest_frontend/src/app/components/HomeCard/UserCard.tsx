import React, { useEffect, useState } from "react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import { useRouter } from "next/navigation";
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  profileImage: string;
  rank: number;
  icons: string[];
}

const UserCard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const getAllUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/user/`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // console.log("respinse in gettitng user:-",response);
      setData(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  // console.log("Users :-", data);

  useEffect(() => {
    getAllUser();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: (
      <button
        className="slick-prev slick-arrow"
        aria-label="Previous"
        type="button"
      >
        Previous
      </button>
    ),
    nextArrow: (
      <button
        className="slick-next slick-arrow"
        aria-label="Next"
        type="button"
      >
        Next
      </button>
    ),
    autoplay: true,

    responsive: [
      {
        breakpoint: 1050,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const renderUserCard = (user: any) => (
    <div
      key={user._id}
      className="outer-home border border-zinc-800 bg-black p-4 shadow-lg group cursor-pointer"
      onClick={() => router.push(`/user/profile/${user._id}`)}
    >
      <div className="flex">
        <div className="flex-col justify-center">
          <div className="image-container md:h-20 md:w-20 w-14 h-14 items-center flex">
            {user?.image && (
              <img
                src={user?.image}
                alt=""
                className="w-full h-full object-cover"
              />
            )}
            {user?.domain?.image && (
              <img
                src={user?.domain?.image}
                alt=""
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="bg_Div_Down-h h-[2rem] mt-2 bg-[#281a28]" />
        </div>

        <div className="flex-1 md:ml-4 ml-2">
          <div className="flex items-center md:justify-between justify-around">
            <div className="flex flex-col justify-start">
              <div
                className="font-semibold font-famFont text-xl "
                style={{ letterSpacing: "2px" }}
              >
                {user?.domain?.domainAddress}
              </div>
              <div className="text-white font-famFont text-md">
                {user?.displayName}
              </div>
            </div>
            <div className="text-famPurple font-famFont text-lg flex items-start">
              <span>
                <i className="bi bi-hash"></i>
              </span>
              <span>{user.rank}</span>
            </div>
          </div>
          <hr className="border-gray-700 my-2 mt-5" />
          <div className="z-10 flex items-center space-x-3 mt-6">
            {["🍎", "⭐", "⭐"].map((icon, index) => (
              <div
                key={index}
                className="bg-[#8C71FF] home-inner-bg clip-trapezium-top-right lg:px-4 sm:px-2 px-2"
              >
                <span role="img" aria-label="Icon" className="">
                  {icon}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center w-full lg:block  hidden">
        <h1 className="text-white/30 " style={{ letterSpacing: "10px" }}>
          {" "}
          . . . . . . . . . . . . .{" "}
        </h1>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto ">
      <div className="flex justify-center sm:justify-start items-center gap-1 mt-10 mb-8">
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
          <p className="font-qanelas">User profile</p>
        </div>
      </div>

      <div className="px-4 sm:px-2">
        <Slider {...settings}>
          {data?.map((user: any, index: number) => (
            <div key={index} className="p-2">
              {renderUserCard(user)}
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default UserCard;
