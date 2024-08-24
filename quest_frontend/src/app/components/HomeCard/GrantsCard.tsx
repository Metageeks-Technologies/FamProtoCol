"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";

type Grant = {
  _id: string;
  title: string;
  description: string;
  logoUrl: string;
  organizer: string;
  prize: string;
};

const GrantsCard = () => {
  const [grantItems, setGrantItems] = useState<Grant[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);

  const getGrants = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/grant`
      );
      setGrantItems(response.data.grants);
      // console.log("grants items :-", response.data);
      setLoading(false);
    } catch (error) {
      console.log("error in getting grants :-", error);
    }
  };

  useEffect(() => {
    getGrants();
  }, []);


  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
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

  return (
    <div className="mb-8 lg:mt-10 md:mt-5 mt-5">
      <div className="flex items-center gap-1 mb-5 ">
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
          <h1>Grants</h1>
        </div>
      </div>

      <div  className=" reasponsive div here  ">
      <Slider { ...settings }>
        {grantItems.map((grant, index) => (
          <div className="relative" key={grant._id}>
            <div className="relative grant-clip bg-gray-500 box1 w-12 ">
              <div
                key={index}
                className=" box2 grant-clip w-full px-5 py-3 home-g"
              >
                <div>
                  <h1
                    className="text-md text-center uppercase"
                    style={{ letterSpacing: "4px" }}
                  >
                    {grant.title}
                  </h1>
                </div>

                <div className="text-center">
                  <h1
                    className="text-white/30"
                    style={{ letterSpacing: "11px" }}
                  >
                    . . . . . . . . .
                  </h1>
                </div>

                <div className="ml-8 mt-3 uppercase">
                  <p className="text-end" style={{ fontSize: "0.6rem" }}>
                    {grant.description}
                  </p>
                </div>

                <div>
                  <img
                    src={grant.logoUrl}
                    alt="Image"
                    className="h-6 w-6 rounded-full object-cover"
                  />
                  <p className="text-sm text-zinc-400 uppercase">
                    {grant.organizer}
                  </p>
                </div>

                <div className="flex justify-center items-center gap-2">
                  <div className="flex-1 text-center">
                    <h2 className="text-white">
                      <span className="text-zinc-400 text-sm uppercase">
                        PRIZE:{" "}
                      </span>
                      ${grant.prize} USDC
                    </h2>
                  </div>
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
            <div className="lg:absolute lg:bottom-0 lg:right-0 sm:absolute sm:bottom-0 sm:-right-2 absolute -bottom-1 -right-1 ">
              <svg
                className="lg:h-5  lg:w-16 sm:h-5 sm:w-20 h-5 w-20 "
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 53 18"
                fill="none"
              >
                <path
                  opacity="0.8"
                  d="M49 -2.3451e-07L19.9572 1.03499e-06C18.9085 1.08083e-06 17.9019 0.411782 17.1538 1.14669L3.48776 14.5733C2.21066 15.8281 3.09908 18 4.88942 18L49 18C51.2091 18 53 16.2091 53 14L53 4C53 1.79086 51.2091 -3.31074e-07 49 -2.3451e-07Z"
                  fill="#5538CE"
                />
                <path
                  d="M49 -1.96701e-06L23.9572 1.03499e-06C22.9085 1.08083e-06 21.9019 0.411782 21.1538 1.14669L7.48776 14.5733C6.21066 15.8281 7.09908 18 8.88942 18L49 18C51.2091 18 53 16.2091 53 14L53 4C53 1.79086 51.2091 -2.06358e-06 49 -1.96701e-06Z"
                  fill="#5538CE"
                />
                <path
                  d="M33 8.75C32.8619 8.75 32.75 8.86193 32.75 9C32.75 9.13807 32.8619 9.25 33 9.25L33 8.75ZM45.1768 9.17678C45.2744 9.07915 45.2744 8.92086 45.1768 8.82322L43.5858 7.23223C43.4882 7.1346 43.3299 7.1346 43.2322 7.23223C43.1346 7.32987 43.1346 7.48816 43.2322 7.58579L44.6464 9L43.2322 10.4142C43.1346 10.5118 43.1346 10.6701 43.2322 10.7678C43.3299 10.8654 43.4882 10.8654 43.5858 10.7678L45.1768 9.17678ZM33 9.25L45 9.25L45 8.75L33 8.75L33 9.25Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
        ))}
         </Slider>
      </div>
    </div>
  );
};

export default GrantsCard;
