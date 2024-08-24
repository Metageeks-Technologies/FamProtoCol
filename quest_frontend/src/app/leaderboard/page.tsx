"use client";
import UserTable from "@/app/components/table/userTable";
import { users, columns } from "./data";
import { User, Column } from "./data";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

const GlobalLeaderboard = () =>
{
  const [ data, setData ] = useState<User[]>( [] );
  const [ topUsers, setTopUsers ] = useState<User[]>( [] );

  const getLeaderBoard = async () =>
  {
    try
    {
      const response = await axios.get(
        `${ process.env.NEXT_PUBLIC_SERVER_URL }/user/`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const allUsers = response.data;

      // Sort users based on rewards.xps in descending order
      const sortedUsers = allUsers.sort( ( a: any, b: any ) =>
        ( b.rewards?.xp || 0 ) - ( a.rewards?.xp || 0 )
      );

      // Take the top 3 users
      const topThreeUsers = sortedUsers.slice( 0, 3 );

      // Set the top 3 users
      setTopUsers( topThreeUsers );

      // Set all users for the table
      setData( sortedUsers );

      // console.log( "Top 3 users:", topThreeUsers );
      // console.log( "All users:", allUsers );
    } catch ( error )
    {
      console.log( error );
      // Handle error (e.g., set default data or show error message)
    }
  };

  useEffect( () =>
  {
    getLeaderBoard();
  }, [] );

  return (
    <div className=" w-[90%] mx-auto">
   

      {/* top3 */ }
      <section className="w-full ">
        <div className="lg:my-4 my-8 flex items-center gap-8 justify-center">
          <div className=" grid sm:grid-cols-2 lg:grid-cols-3 lg:gap-0 sm:gap-8 gap-2 m-auto w-full justify-center ">
            <div className=" p-[1px] lg:w-[26rem] lg:h-[13rem] sm:w-[20rem] sm:h-[10rem] w-[17rem] h-[8rem]  bg-[#282828] outer_leader_div">
              <div className=" lg:w-[26rem] lg:h-[13rem]  sm:w-[20rem] sm:h-[10rem] w-[17rem] h-[8rem]  rank-box  ">
                <div className="w-full h-full innerbox flex justify-center pt-2 sm:pt-[26px] items-center ">
                  <div className="sm:w-[11rem] w-[130px] pt-2 sm:pt-0 mx-auto h-[114px] sm:h-[10rem] pl-0 ">
                    <img
                      className=" w-full h-full "
                      // style={{ padding: "2.5rem 0rem 0rem 0.5rem" }}
                      src={ topUsers[ 1 ]?.image }
                      alt="rank2 image"
                    />
                  </div>
                  <div className=" flex flex-col   m-auto justify-center items-end">
                    <div className=" w-full justify-center m-auto text-lg sm:text-xl text-center sm:my-2">{ topUsers[ 1 ]?.displayName }</div>
                    <div className="">
                      <div className="  flex gap-2 justify-center items-center">
                        <span>XPS</span>
                        <div className="bg-violet-500/25 px-2 border-l-2 text-sm sm:text-lg  border-[#8c71ff]">{ ( topUsers[ 1 ]?.rewards.xp ) }</div>
                        <span>COINS</span>
                        <div className="bg-violet-500/25 px-2 border-l-2 text-sm sm:text-lg border-[#8c71ff]">{ topUsers[ 1 ]?.rewards.coins } </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:my-16 p-[1px] lg:w-[26rem] lg:h-[13rem]  sm:w-[20rem] sm:h-[10rem] w-[17rem] h-[8rem]  bg-[#282828] outer_leader_div">
              <div className=" lg:w-[26rem] lg:h-[13rem]  sm:w-[20rem] sm:h-[10rem] w-[17rem] h-[8rem]  rank-box  ">
                <div className="w-full h-full innerbox flex justify-center pt-2 sm:pt-[26px] items-center ">
                  <div className="sm:w-[11rem] w-[130px] pt-2 sm:pt-0 mx-auto h-[114px] sm:h-[10rem] pl-0 ">
                    <img
                      className=" w-full h-full "
                      // style={{ padding: "2.5rem 0rem 0rem 0.5rem" }}
                      src={ topUsers[ 0 ]?.image }
                      alt="rank2 image"
                    />
                  </div>
                  <div className=" flex flex-col   m-auto justify-center items-end">
                    <div className=" w-full justify-center m-auto text-lg sm:text-xl text-center sm:my-2">{ topUsers[ 0 ]?.displayName }</div>
                    <div className="">
                      <div className="  flex gap-2 justify-center items-center">
                          <span>
                            XPS
                        </span>
                        <div className="bg-violet-500/25 px-2 border-l-2 text-sm sm:text-lg  border-[#8c71ff]">
                          { topUsers[ 0 ]?.rewards.xp } </div>
                        <span>COINS</span>
                        <div className="bg-violet-500/25 px-2 border-l-2 text-sm sm:text-lg border-[#8c71ff]"> { topUsers[ 0 ]?.rewards.coins }</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className=" p-[1px] lg:w-[26rem] lg:h-[13rem] sm:w-[20rem] sm:h-[10rem] w-[17rem] h-[8rem]  bg-[#282828] outer_leader_div">
              <div className="lg:w-[26rem] lg:h-[13rem] sm:w-[20rem] sm:h-[10rem] w-[17rem] h-[8rem]  rank-box  ">
                <div className="w-full h-full innerbox flex justify-center pt-2 sm:pt-[26px] items-center ">
                  <div className="sm:w-[11rem] w-[130px] pt-2 sm:pt-0 mx-auto h-[114px] sm:h-[10rem] pl-0 ">
                    <img
                      className=" w-full h-full "
                      // style={{ padding: "2.5rem 0rem 0rem 0.5rem" }}
                      src={ topUsers[ 2 ]?.image }
                      alt="rank2 image"
                    />
                  </div>
                  <div className=" flex flex-col   m-auto justify-center items-end">
                    <div className=" w-full justify-center m-auto text-lg sm:text-xl text-center sm:my-2">{ topUsers[ 2 ]?.displayName }</div>
                    <div className="">
                      <div className="  flex gap-2 justify-center items-center">
                          <span>
                            XPS
                          </span>
                        <div className="bg-violet-500/25 px-2 border-l-2 text-sm sm:text-lg  border-[#8c71ff]">
                          <span>
                            { ( topUsers[ 2 ]?.rewards.xp ) }
                          </span>
                        </div>
                          <span>
                            COINS
                          </span>
                        <div className="bg-violet-500/25 px-2 border-l-2 text-sm sm:text-lg border-[#8c71ff]">
                          <span>
                            { topUsers[ 2 ]?.rewards.coins }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* leaderboard table */ }
      <section className="w-full flex flex-col justify-center items-center">

        <div className="flex flex-row justify-center my-2 gap-3 text-pink-950 lg:text-5xl">
          - - - - - - - - - - -
        </div>

        <div className="my-4 flex items-center gap-2 justify-center">
          <div className="">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="11" viewBox="0 0 15 11" fill="none">
              <path d="M0.5 1H5.98652L14.5 10" stroke="#FA00FF" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5.5 5L10.5 10" stroke="#FA00FF" strokeLinecap="round" />
            </svg>
          </div>
          <div className="listOfFriends">Leaderboard</div>
        </div>
        <div className="w-[90%] lg:w-[80%] flex userTable justify-center items-center bg-[#040404] ">
          <UserTable<User> data={ data } columns={ columns } rowsPerPage={ 5 } />
        </div>
      </section>
    </div>
  );
};

export default GlobalLeaderboard;
