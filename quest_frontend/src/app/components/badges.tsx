import Image from "next/image";
import React from "react";

type UserData = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
};
const Badges: React.FC = () => {

  const userData: UserData[] = [
    {
      id: 1,
      title: "Badges",
      description: "Lorem ipsum dolor sit amet.",
      imageUrl:
        "https://i.pinimg.com/originals/88/ea/0a/88ea0a1c3c448867bb7133692c5c6682.png",
    },
    {
      id: 2,
      title: "Badges",
      description: "Lorem ipsum dolor sit amet.",
      imageUrl:
        "https://antonia.lv/images/izsole79/staba-bataljona-zetons_511_xl.jpg",
    },
    {
      id: 3,
      title: "Badges",
      description: "Lorem ipsum dolor sit amet.",
      imageUrl:
        "https://cdna.artstation.com/p/assets/images/images/063/962/232/large/divya-theepireddy-icon-1-copy.jpg?1686768810",
    },
    {
      id: 4,
      title: "Badges",
      description: "Lorem ipsum dolor sit amet.",
      imageUrl:
        "https://cdna.artstation.com/p/assets/images/images/063/962/232/large/divya-theepireddy-icon-1-copy.jpg?1686768810",
    },
    {
      id: 5,
      title: "Badges",
      description: "Lorem ipsum dolor sit amet.",
      imageUrl:
        "https://cdna.artstation.com/p/assets/images/images/063/962/232/large/divya-theepireddy-icon-1-copy.jpg?1686768810",
    },
    {
      id: 6,
      title: "Badges",
      description: "Lorem ipsum dolor sit amet.",
      imageUrl:
        "https://cdna.artstation.com/p/assets/images/images/063/962/232/large/divya-theepireddy-icon-1-copy.jpg?1686768810",
    },
    {
      id: 7,
      title: "Badges",
      description: "Lorem ipsum dolor sit amet.",
      imageUrl:
        "https://antonia.lv/images/izsole79/staba-bataljona-zetons_511_xl.jpg",
    },
    {
      id: 8,
      title: "Badges",
      description: "Lorem ipsum dolor sit amet.",
      imageUrl:
        "https://i.pinimg.com/originals/88/ea/0a/88ea0a1c3c448867bb7133692c5c6682.png",
    },
  ]



  return (
    <>
      <div className="main div">
      
      <div className="card max-w-[1320px] md:py[80] py-5 mx-auto grid lg:grid-cols-5 sm:grid-cols-2 gap-4">
          {userData.map((data) => (
            <div
              key={data.id}
              className="group shadow-lg p-5 flex flex-col items-center justify-center hover:bg-slate-400 bg-slate-800 duration-1000 rounded-md cursor-pointer"
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
      </div>
    </>
  );
};

export default Badges;
