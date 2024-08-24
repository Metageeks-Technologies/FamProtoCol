import Image from "next/image";
import React from "react";

interface Card {
  id: number;
  image: string;
  name: string;
  description: string;
}

interface BoardData {
  id: number;
  image: string;
  name: string;
  location: string;
  points: string;
}

const Board: BoardData[] = [
  {
    id: 4,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUPIfiGgUML8G3ZqsNLHfaCnZK3I5g4tJabQ&s",
    name: "John Doe",
    location: "New York",
    points: "330 XP",
  },
  {
    id: 5,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUPIfiGgUML8G3ZqsNLHfaCnZK3I5g4tJabQ&s",
    name: "Jane Smith",
    location: "San Francisco",
    points: "320 XP",
  },
  {
    id: 7,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUPIfiGgUML8G3ZqsNLHfaCnZK3I5g4tJabQ&s",
    name: "Alice Johnson",
    location: "Los Angeles",
    points: "310 XP",
  },
  {
    id: 8,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUPIfiGgUML8G3ZqsNLHfaCnZK3I5g4tJabQ&s",
    name: "Jane Doe",
    location: "Chicago",
    points: "270 XP",
  },
  {
    id: 9,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUPIfiGgUML8G3ZqsNLHfaCnZK3I5g4tJabQ&s",
    name: "Alice Smith",
    location: "Miami",
    points: "250 XP",
  },
];

const Data: Card[] = [
  {
    id: 1,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUPIfiGgUML8G3ZqsNLHfaCnZK3I5g4tJabQ&s",
    name: "John Doe",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: 2,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUPIfiGgUML8G3ZqsNLHfaCnZK3I5g4tJabQ&s",
    name: "Jane Smith",
    description: "Sed do eiusmod tempor incididunt ut labore et dolore.",
  },
  {
    id: 3,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUPIfiGgUML8G3ZqsNLHfaCnZK3I5g4tJabQ&s",
    name: "Alice Johnson",
    description: "Ut enim ad minim veniam, quis nostrud exercitation .",
  },
];

const Leaderboard: React.FC = () => {
  return (
    <>
      <div className="main div p-4 md:p-8 lg:p-5">
        <div className="mt-5">
          <div className="flex flex-col md:flex-row justify-center gap-16 mb-6">
            {Data.map((item) => (
              <div
                key={item.id}
                className="w-full md:w-[250px] h-[350px] bg-slate-100 hover:bg-slate-300 duration-1000 rounded-md shadow-lg flex flex-col items-center justify-center"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-32 w-32 rounded-full object-cover mb-4"
                />
                <div className="p-4 text-center">
                  <h2 className="text-slate-700 text-xl font-bold">
                    {item.name}
                  </h2>
                  <p className="text-gray-700">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          <hr />
        </div>
        <div className="mt-10">
          {Board.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row bg-slate-400 justify-between items-center w-full md:w-[750px] m-auto rounded-md shadow-lg hover:bg-slate-300 duration-1000 p-4 mt-5"
            >
              <div className="item flex justify-evenly items-center w-full md:w-auto">
                <p className="px-2 font-bold text-slate-600">{item.id}.</p>
                <img
                  src={item.image}
                  alt="image"
                  className="h-16 w-16 rounded-full"
                />
                <div className="info pl-4">
                  <h3 className="text-dark font-bold text-slate-700">
                    {item.name}
                  </h3>
                  <span className="text-slate-700">{item.location}</span>
                </div>
              </div>
              <div className="font-bold text-slate-700 mt-4 md:mt-0 text-center">
                <span>{item.points}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Leaderboard;
