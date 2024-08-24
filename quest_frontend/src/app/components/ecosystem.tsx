"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type UserData = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
};

type CardData = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
};

const Ecosystem: React.FC = () => {
  const router = useRouter();

  const handleIconClick = () => {
    router.push("/user/community-project");
  };

  const userData: UserData[] = [
    {
      id: 1,
      title: "Avatar",
      description: "Lorem ipsum dolor sit amet.",
      imageUrl:
        "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg",
    },
    {
      id: 2,
      title: "Avatar",
      description: "Lorem ipsum dolor sit amet.",
      imageUrl:
        "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg",
    },
    {
      id: 3,
      title: "Avatar",
      description: "Lorem ipsum dolor sit amet.",
      imageUrl:
        "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg",
    },
    {
      id: 4,
      title: "Avatar",
      description: "Lorem ipsum dolor sit amet.",
      imageUrl:
        "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg",
    },
    {
      id: 5,
      title: "Avatar",
      description: "Lorem ipsum dolor sit amet.",
      imageUrl:
        "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg",
    },
    {
      id: 6,
      title: "Avatar",
      description: "Lorem ipsum dolor sit amet.",
      imageUrl:
        "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg",
    },
    {
      id: 7,
      title: "Avatar",
      description: "Lorem ipsum dolor sit amet.",
      imageUrl:
        "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg",
    },
    {
      id: 8,
      title: "Avatar",
      description: "Lorem ipsum dolor sit amet.",
      imageUrl:
        "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg",
    },
    {
      id: 9,
      title: "Avatar",
      description: "Lorem ipsum dolor sit amet.",
      imageUrl:
        "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg",
    },
    {
      id: 10,
      title: "Avatar",
      description: "Lorem ipsum dolor sit amet.",
      imageUrl:
        "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg",
    },
  ];

  const cardData: CardData[] = [
    {
      id: 1,
      title: "Nature",
      description:
        "Lorem ipsum dolor sit amt consectetur adipisicing elit. Quo quisquam consequatur illo perferendis tempore officia, itaque et autem voluptate ratione unde distinctio odit natus culpa numquam modi nemo blanditiis voluptatum",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUPIfiGgUML8G3ZqsNLHfaCnZK3I5g4tJabQ&s",
    },
    {
      id: 2,
      title: "Nature",
      description:
        "Lorem ipsum dolor sit amt consectetur adipisicing elit. Quo quisquam consequatur illo perferendis tempore officia, itaque et autem voluptate ratione unde distinctio odit natus culpa numquam modi nemo blanditiis voluptatum",
      imageUrl:
        "https://thumbs.dreamstime.com/b/beautiful-rain-forest-ang-ka-nature-trail-doi-inthanon-national-park-thailand-36703721.jpg",
    },
    {
      id: 3,
      title: "Nature",
      description:
        "Lorem ipsum dolor sit amt consectetur adipisicing elit. Quo quisquam consequatur illo perferendis tempore officia, itaque et autem voluptate ratione unde distinctio odit natus culpa numquam modi nemo blanditiis voluptatum",
      imageUrl:
        "https://webneel.com/daily/sites/default/files/images/daily/08-2018/1-nature-photography-spring-season-mumtazshamsee.jpg",
    },
  ];

  return (
    <>
      <div className="maindiv">
        <div className="logodiv bg-[#141d35] text-3xl font-bold w-full h-20 text-[#4169E1] text-center flex justify-center items-center rounded shadow-blue-500/50 ">
          Eco <span className="text-white">System</span>
        </div>

        <div className="card max-w-[1320px] md:py[80] py-5 mx-auto grid lg:grid-cols-5 sm:grid-cols-2 gap-4">
          {userData.map((data) => (
            <div
              onClick={handleIconClick}
              key={data.id}
              className="group shadow-lg p-5 flex flex-col items-center justify-center hover:bg-slate-400 duration-1000 rounded-md  cursor-pointer"
            >
              <img
                src={data.imageUrl}
                className="mx-auto rounded-full w-24 h-24 object-cover"
                alt={data.title}
              />
              <h1 className="text-center text-xl py-1 font-normal">
                {data.title}
              </h1>
              <p>{data.description}</p>
            </div>
          ))}
        </div>
        <hr />

        <div className="">
          <div className="card max-w-[1320px] md:py[80] py-5 mx-auto grid lg:grid-cols-3 sm:grid-cols-1 gap-10">
            {cardData.map((data) => (
              <div
                key={data.id}
                className="mx-auto shadow-lg rounded flex flex-col items-center justify-center md:w-96"
              >
                <div className="overflow-hidden w-full h-56 rounded-t flex items-center justify-center">
                  <img
                    src={data.imageUrl}
                    alt={data.title}
                    className="hover:scale-125 duration-1000 w-full h-full object-cover"
                  />
                </div>
                <h1 className="py-1 text-xl font-semibold text-zinc-600">
                  {data.title}
                </h1>
                <p className="py-1 text-center text-gray-600 p-10">
                  {data.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Ecosystem;
