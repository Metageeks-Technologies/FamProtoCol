import React from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaBolt, FaTwitter, FaPlus } from "react-icons/fa";
import { CommunityCardType } from "@/types/types";

const CommunityCard: React.FC<{ data: CommunityCardType,type?:string }> = ({ data,type='user'}) => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/${type==="kol"?"kol":"user"}/community-project/${data?._id}`)}
      className="overflow-hidden cursor-pointer  outer-div bg-white/5 rounded-md relative flex md:gap-6 lg:gap-6 sm:gap-4 gap-4 hover:bg-[#8c71ff] hover:text-[#111111] border-[#282828] border md:p-4 lg:p-4 p-2 flex-col  justify-center w-full sm:w-full"
    >
      <div className="flex flex-row text-xl items-center justify-around ">
        <div className="w-1/3 p-1">
          <div className="image-container h-[5rem] w-[5rem] md:h-[5rem] md:w-[5rem]">
            <img src={data.logo} alt={data.title} className="w-full h-full object-cover" />
          </div>
          <div className="bg_Div_Down h-[2rem] md:h-[2rem] bg-gray-800"/>
        </div>
        <div className="w-2/3 flex flex-col justify-start gap-2 ">
          <div className="flex w-full flex-col items-start ">
            <div className="flex w-full h-[5rem] bg_eco_div border-b-4 border-[#8c71ff] gap-2 md:gap-2 p-2 bg-[#28223d] items-end justify-between ">
              <div className="md:w-4/5 p text-wrap  truncate text-[12px] md:text-[10px] lg:text-[15px] md:ml-3 md:text-start text-center card-title ">
                {data.title}
              </div>

              <div className="md:1/5 flex flex-row rounded-lg justify-center md:justify-end">
                <div className="flex gap-1 mr-2 items-center flex-col">
                  <span className="card-white-text text-xs sm:text-sm">
                    {data.quests.length}
                  </span>
                  <span className=" card-gray-text font-famFont text-xs sm:text-sm">QUESTS</span>
                </div>
                <div className="flex gap-1 items-center flex-col">
                  <span className="card-white-text text-xs sm:text-sm">
                    {data.members.length}
                  </span>
                  <span className=" card-gray-text font-famFont text-xs sm:text-sm ">
                    FOLLOWERS
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-row justify-end gap-2">
            <div className="flex bg-[#8C71FF] py-1 px-2 items-center">
              <FaUser className="md:w-4 w-4 h-4 md:h-4" />
              <div className="pl-1 text-sm">{data.members.length}</div>
            </div>
            <div className="flex bg-[#8C71FF] py-1 px-2 items-center">
              <FaBolt className="md:w-4 w-4 h-4 md:h-4" />
              <div className="pl-1 text-sm">{data.quests.length}</div>
            </div>
            <div className="flex bg-[#8C71FF] py-1 px-2 items-center">
              <FaTwitter className="md:w-4 w-4 h-4 md:h-4" />
              <div className="pl-1 text-sm"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row text-xs m-1 gap-2 justify-start  ">
        <span className="descText">Bio: </span>
        <span className="break-words text-white opacity-30 text-[0.8rem] overflow-hidden line-clamp-2 font-famFont uppercase ">
          {data.description.slice(0, 20)}
        </span>
      </div>
    </div>
  );
};

export default CommunityCard;
