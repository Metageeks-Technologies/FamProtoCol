import React from "react";
import {useRouter} from 'next/navigation'

// Define the TypeScript type for the card data
type CommunityCardData = {
  _id: string;
  logo: string;
  title: string; // alphahub
  quests: []; // length
  description: string; // bio
  members: [];
};

// CommunityCard component
const CommunityCard: React.FC<{ data: CommunityCardData }> = ({ data }) => {
  const router=useRouter();
  // console.log(data);
  return (
    
    <div className="cursor-pointer" onClick={() => {router.push(`/kol/community-project/${data._id}`)}}>
      <div className="outer-div relative flex lg:gap-2 sm:gap-4 gap-4  hover:bg-[#8c71ff] hover:text-[#111111] border-[#282828] border rounded-md lg:p-5 sm:p-2 p-4 flex-col justify-center w-full sm:w-full ">
        <div className="flex flex-row text-xl items-center justify-around ">
          <div className="p-1">
            <div className="image-container md:h-[5rem] md:w-[5rem] h-[4rem] w-[4rem] items-center flex">
              <img src={data?.logo} alt="" className="styled-image" />
            </div>
            <div className="bg_Div_Down h-[2rem] mt-2 bg-gray-800" />
          </div>

          <div className="md:w-2/3 w-2/3 flex flex-col justify-start gap-2 ">
            <div className="flex w-full flex-col items-start ">
              <div className="flex w-full md:h-[5rem] bg_eco_div border-b-4 border-[#8c71ff] gap-2 md:gap-2  p-2 bg-[#28223d] flex-col lg:flex-row items-center md:items-end lg:items-end justify-between ">
                <div className="md:w-4/5  w-4/5 truncate text-[12px] md:text-[10px] lg:text-[10px] md:ml-3 md:text-start text-center card-title">
                  {data.title}
                </div>

                <div className="md:1/5 flex flex-row rounded-lg justify-center md:justify-end">
                  <div className="flex gap-1 mr-2 items-center flex-col">
                    <span className="card-white-text text text-lg ">
                      {data.quests.length}
                    </span>
                    <span className=" card-gray-text text-3xl">QUESTS</span>
                  </div>
                  <div className="flex gap-1 items-center flex-col">
                    <span className="card-white-text text-lg">
                      {data.members.length}
                    </span>
                    <span className=" card-gray-text text-lg">FOLLOWERS</span>
                  </div>
                </div>
                
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

        <div>
          <div className="flex flex-row text-xs h-[5vh] m-1 gap-2 justify-start">
            <span className="descText">Bio:</span>
            <span className="descdata text-wrap break-words overflow-hidden line-clamp-2">
              {data.description}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityCard;
