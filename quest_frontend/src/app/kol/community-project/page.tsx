import React from "react";
import {
  faTwitter,
  faFacebook,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

type TopRankData = {
  id: number;
  name: string;
  imageUrl: string;
};

const Community : React.FC = () => {
 
  const TopRankData: TopRankData[] = [
    {
      id: 1,
      name: "John",
      imageUrl: "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg",
    },
    {
      id: 2,
      name: "John",
      imageUrl: "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg",
    },
    {
      id: 3,
      name: "John",
      imageUrl: "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg",
    },
    {
      id: 4,
      name: "John",
      imageUrl: "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg",
    },
    {
      id: 5,
      name: "John",
      imageUrl: "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg",
    },
  ]
  return (
    <>
      <div className="Main div">
        <div className="logodiv bg-[#141d35] text-3xl font-bold w-full h-20 text-[#4169E1] text-center flex justify-center items-center rounded shadow-blue-500/50 ">
          Project <span className="text-white">Banner</span>
        </div>

        <div className="logo&n max-w-[1320px] py-5 flex flex-col md:flex-row mx-auto">
          <div className="basis-[40%] flex flex-col items-center md:items-start">
            <img
              src="https://shiftart.com/wp-content/uploads/2017/04/RC-Profile-Square.jpg"
              alt=""
              className="rounded-full w-64 h-64 object-cover"
            />
            <div className="flex justify-center lg:justify-start pt-6 pl-6 space-x-2">
              <FontAwesomeIcon
                icon={faTwitter}
                size="lg"
                className="text-zinc-950 w-14 h-8 neumorphism-icon cursor-pointer"
              />
              <FontAwesomeIcon
                icon={faFacebook}
                size="lg"
                className="text-blue-600 w-12 h-8 cursor-pointer"
              />
              <FontAwesomeIcon
                icon={faInstagram}
                size="lg"
                className="text-pink-600 w-9 h-8 cursor-pointer"
              />
            </div>
          </div>
          <div className="basis-[60%] px-5 pt-16">

            {/* dummy text*/}
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rem,
              possimus doloremque vitae, quis consequatur magnam ipsam autem
              adipisci inventore mollitia illo assumenda! Quasi dicta
              voluptatibus nulla in aliquid excepturi accusantium.
              <br />
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rem,
              possimus doloremque vitae, quis consequatur magnam ipsam autem
              adipisci inventore mollitia illo assumenda! Quasi dicta
              voluptatibus nulla in aliquid excepturi accusantium.
            </p>
          </div>
        </div>
        <div className="card p max-w-[1320px] py-5 flex flex-col lg:flex-row mx-auto gap-4">
          <div className="grid lg:grid-cols-5 md:grid-cols-5 gap-4 basis-[70%]">
            {TopRankData.map((data) => (
              <div
                key={data.id}
                className="shadow-lg flex flex-col items-center h-40  justify-center hover:bg-slate-400 duration-1000 rounded-md hover:animate-pulse cursor-pointer"
              >
                 <img src={data.imageUrl} className="mx-auto rounded-full w-24 h-24 object-cover" alt={data.name}/>
                <p className="text-center text py-1 font-semibold text-zinc-600">{data.name}</p>
              </div>
            ))}
           <div className="flex flex-col space-y-4">
              <div className="h-8 lg:flex-col bg-slate-400 w-full md:w-[900px] mx-auto flex-col m-3 rounded-md text-white text-center hover:bg-blue-400 duration-1000 hover:animate-pulse cursor-pointer p-5">
              </div>
              <div className="h-8 bg-slate-400 w-full md:w-[900px] mx-auto flex-col m-3 text-white text-center rounded-md hover:bg-blue-400 duration-1000 hover:animate-pulse cursor-pointer p-5">
              </div>
              <div className="h-8 bg-slate-400 w-full md:w-[900px] mx-auto flex-col m-3 text-white text-center hover:bg-blue-400 duration-1000 hover:animate-pulse cursor-pointer rounded-md p-5">
              </div>
            </div>

          </div>
          <div className="flex flex-col space-y-4 basis-[30%]">
            <div className=" mx-auto shadow-lg flex flex-col items-center justify-center hover:bg-slate-400 duration-1000 rounded-md hover:animate-pulse cursor-pointer h-28 w-72 bg-slate-200">
              Sprint timer
            </div>
            <div className="mx-auto shadow-lg flex flex-col items-center justify-center hover:bg-slate-400 duration-1000 rounded-md hover:animate-pulse cursor-pointer h-44 w-60 bg-slate-200">
              About reward  pool
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Community;
