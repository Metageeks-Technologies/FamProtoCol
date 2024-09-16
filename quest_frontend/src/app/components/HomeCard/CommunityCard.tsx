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
      <div className="flex  flex-col md:flex-row lg:flex-row text-xl items-center justify-around ">
        <div className="p-1">
          <div className="image-container h-[3rem] w-[3rem] md:h-[5rem] md:w-[5rem] items-center flex ">
            <img src={data.logo} alt="style image" className="styled-image" />
          </div>
          <div className="bg_Div_Down h-[1rem] md:h-[2rem] bg-gray-800"> </div>
        </div>
        <div className="md:w-2/3 flex flex-col justify-start gap-2 ">
          <div className="flex w-full flex-col items-start ">
            <div className="flex w-full md:h-[5rem] bg_eco_div border-b-4 border-[#8c71ff] gap-2 md:gap-2  p-2 bg-[#28223d] flex-col lg:flex-row items-center md:items-end lg:items-end justify-between ">
              <div className="md:w-4/5 p truncate text-[12px] md:text-[10px] lg:text-[15px] md:ml-3 md:text-start text-center card-title ">
                {data.title}
              </div>

              <div className="md:1/5 flex flex-row rounded-lg justify-center md:justify-end">
                <div className="flex gap-1 mr-2 items-center flex-col">
                  <span className="card-white-text  ">
                    {data.quests.length}
                  </span>
                  <span className=" card-gray-text font-famFont ">QUESTS</span>
                </div>
                <div className="flex gap-1 items-center flex-col">
                  <span className="card-white-text ">
                    {data.members.length}
                  </span>
                  <span className=" card-gray-text font-famFont ">
                    FOLLOWERS
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-row justify-end gap-2">
            <div className="flex bg-[#8C71FF] py-1 px-2 items-center">
              <FaUser className="md:w-4 w-2 h-2 md:h-4" />
              <div className="pl-1 text-sm">{data.members.length}</div>
            </div>
            <div className="flex bg-[#8C71FF] py-1 px-2 items-center">
              <FaBolt className="md:w-4 w-2 h-2 md:h-4" />
              <div className="pl-1 text-sm">{data.quests.length}</div>
            </div>
            <div className="flex bg-[#8C71FF] py-1 px-2 items-center">
              <FaTwitter className="md:w-4 w-2 h-2 md:h-4" />
              <div className="pl-1 text-sm"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row text-xs m-1 gap-2 justify-start  ">
        <span className=" descText">Bio: </span>
        <span className="break-words text-white opacity-30 text-[0.8rem] overflow-hidden line-clamp-2 font-famFont uppercase ">
          {data.description.slice(0, 20)}
        </span>
      </div>
    </div>
    // <div className="cursor-pointer" onClick={() => {router.push(`/user/community-project/${data._id}`)}}>
    //   <div className="outer-div relative flex lg:gap-2 sm:gap-4 gap-4  hover:bg-[#8c71ff] hover:text-[#111111] border-[#282828] border rounded-md lg:p-5 sm:p-2 p-4 flex-col justify-center w-full sm:w-full ">
    //     <div className="flex flex-row text-xl items-center justify-around ">
    //       <div className="p-1">
    //         <div className="image-container md:h-[5rem] md:w-[5rem] h-[4rem] w-[4rem] items-center flex">
    //           <img src={data?.logo} alt="" className="styled-image" />
    //         </div>
    //         <div className="bg_Div_Down h-[2rem] mt-2 bg-gray-800" />
    //       </div>

    //       <div className="md:w-2/3 w-2/3 flex flex-col justify-start gap-2 ">
    //         <div className="flex w-full flex-col justify-start items-start ">
    //           <div className="flex w-full md:h-[5rem] bg_eco_div border-b-4 border-[#8c71ff] gap-2 md:gap-2  p-2 bg-[#28223d] flex-col lg:flex-row items-center md:items-end lg:items-end justify-between ">
    //             <div className="md:w-4/5 p truncate text-[12px] md:text-[10px] lg:text-[15px] md:ml-3 md:text-start text-center card-title">
    //               {data.title}
    //             </div>

    //             <div className="md:1/5 flex flex-row rounded-lg justify-center md:justify-end">
    //               <div className="flex gap-1 mr-2 items-center flex-col">
    //                 <span className="card-white-text text text-lg ">
    //                   {data.quests.length}
    //                 </span>
    //                 <span className=" card-gray-text text-3xl font-famFont ">QUESTS</span>
    //               </div>
    //               <div className="flex gap-1 items-center flex-col">
    //                 <span className="card-white-text text-lg">
    //                   {data.members.length}
    //                 </span>
    //                 <span className=" card-gray-text font-famFont text-lg">FOLLOWERS</span>
    //               </div>
    //             </div>

    //           </div>
    //         </div>
    //       </div>

    //     </div>

    //     <div className="absolute -top-1 -right-1">
    //       <svg
    //         xmlns="http://www.w3.org/2000/svg"
    //         width="6"
    //         height="6"
    //         viewBox="0 0 4 4"
    //         fill="none"
    //       >
    //         <path d="M0.5 0V3.5H4" stroke="white" />
    //       </svg>
    //     </div>

    //     <div>
    //       <div className="flex flex-row h-[5vh] gap-2 justify-start">
    //       <div className="px-6 py-2 flex justify-start items-start gap-1 ">
    //       <span className="font-famFont text-white text-[0.8rem] ">Bio:</span>
    //         <span className="break-words text-white opacity-30 text-[0.8rem] overflow-hidden line-clamp-2 font-famFont uppercase">
    //           {data.description}
    //         </span>
    //       </div>

    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default CommunityCard;
