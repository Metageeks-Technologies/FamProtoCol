import { fetchAllQuests } from "@/redux/reducer/questSlice";
import { AppDispatch, RootState } from "@/redux/store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


// this will suffle and only provide randam 3 quests
const shuffleArray = ( array: any[] ) =>
{
  for ( let i = array.length - 1; i > 0; i-- )
  {
    const j = Math.floor( Math.random() * ( i + 1 ) );
    [ array[ i ], array[ j ] ] = [ array[ j ], array[ i ] ];
  }
  return array;
};

const SkeletonCard = () => (
  <div className="animate-pulse">
    <div className="box1 education-clip bg-gray-700 ">
      <div className="education-clip box2 border h-28 w-48 bg-gray-600 flex justify-center items-center p-4">
        <div className="h-16 w-36 bg-gray-500"></div>
      </div>
    </div>
    <div className="mt-2 flex gap-3">
      <div className="h-6 w-6 rounded-full bg-gray-500"></div>
      <div className="h-4 w-24 bg-gray-500 rounded"></div>
    </div>
    <div className="mt-2">
      <div className="h-3 w-full bg-gray-500 rounded mb-2"></div>
      <div className="h-3 w-3/4 bg-gray-500 rounded"></div>
    </div>
  </div>
);

const EducationCardList: React.FC = () =>
{
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { allQuests, loading } = useSelector( ( state: RootState ) => state.quest );

  // Filter and shuffle education quests
  const educationQuests = Array.isArray(allQuests)
  ? shuffleArray(
      allQuests.filter((quest: any) =>
        quest?.categories?.some(
          (category: any) => category?.name?.toLowerCase() === 'education'
        )
      )
    ).slice(0, 3)
  : [];


  // Filter and shuffle KOL quests
 const kolQuests = Array.isArray(allQuests)
  ? shuffleArray(
      allQuests.filter((quest: any) =>
        quest?.categories?.some(
          (category: any) => category?.name?.toLowerCase() === 'kol quest'
        )
      )
    ).slice(0, 3)
  : [];


  useEffect( () =>
  {
    dispatch( fetchAllQuests() );
  }, [dispatch] );
  return (
    <div className=" gap-1 lg:mt-10 md:mt-5 mt-5">
      <div className="mb-8">
        <svg
          className="w-full"
          xmlns="http://www.w3.org/2000/svg"

          height="2"
          viewBox="0 0 1082 2"
          fill="none"
        >
          <path
            opacity="0.8"
            d="M1 1L1081 1.00009"
            stroke="url(#paint0_linear_63_791)"
            strokeLinecap="round"
            strokeDasharray="13 13"
          />
          <defs>
            <linearGradient
              id="paint0_linear_63_791"
              x1="1"
              y1="1.5"
              x2="1081"
              y2="1.50009"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#8C71FF" stopOpacity="0" />
              <stop offset="1" stopColor="#FA00FF" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="main flex flex-col lg:flex-row gap-16 ">
        <div>
          <div className="relative">
            <div className="flex ml-8 items-center gap-1 absolute bottom-6 left-0">
              <img src="" alt="" />
              <div>
                <h1 className="text-gray-400 font-thin">Educational quests</h1>
              </div>
            </div>

            <div className="relative">
              <div className="">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="160"
                  height="59"
                  viewBox="0 0 160 59"
                  fill="none"
                >
                  <path
                    d="M1 0.5L46 45.5H137L149.5 58H160"
                    stroke="url(#paint0_linear_69_326)"
                    strokeOpacity="0.5"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_69_326"
                      x1="0.99999"
                      y1="1.00001"
                      x2="160"
                      y2="58"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0.74102" stopColor="white" />
                      <stop offset="1" stopColor="#999999" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="absolute top-0 left-0 ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="6"
                  height="6"
                  viewBox="0 0 4 4"
                  fill="none"
                >
                  <path d="M0 3.5L3.5 3.5L3.5 4.17371e-08" stroke="#FA00FF" />
                </svg>
              </div>
              <div className="absolute bottom-0 left-40 ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="7"
                  height="6"
                  viewBox="0 0 5 4"
                  fill="none"
                >
                  <path d="M4.5 3.5L1 3.5L1 4.17371e-08" stroke="#FA00FF" />
                </svg>
              </div>
            </div>
          </div>

          <div className="p-2  edu neo mt-5 grid lg:gap-10 sm:gap-10 gap-4 mx-8 lg:mx-0 grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 lg:basis-[50%]">
            { loading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : ( educationQuests?.map( ( data, index ) => (
              <div key={ index } className="cursor-pointer" onClick={ () => router.push( `/user/community-project/${ data?.community }` ) } >
                <div>
                  <div className="box1 education-clip bg-red-700 ">
                    <div className="education-clip box2 border h-28 w-48 bg-red-700/10 flex justify-center items-center p-4">
                      <div>
                        <img
                          src={ data.logo }
                          alt=""
                          className="h-16 w-36 object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 flex gap-3  justify-center">
                   
                    <div>
                      <p className="text-small text-slate-300">{ data.title }</p>
                    </div>
                  </div>
                  <div>
                  </div>
                </div>
              </div>
            ) ) ) }
          </div>
        </div>

        {/* pending */ }
          <div className="w-1/2">
            <div className="flex items-center justify-start">
             <div> <img src="https://clusterprotocol2024.s3.amazonaws.com/others/Group+44.png" alt="seprator" /></div>
              <div>
                <h1 className="text-gray-400 font-thin">KOL quests</h1>
              </div>
            </div>
          <div className="mt-5 neo p-2 grid lg:gap-10 sm:gap-10 gap-4 mx-8 lg:mx-0 grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 lg:basis-[50%]">
            { loading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : ( kolQuests.map( ( data, index ) => (
              <div key={ index } className="">
                <div>
                  <div className="box1 education-clip bg-red-600">
                    <div className="education-clip box2 border h-28 w-48 bg-red-700/10 flex justify-center items-center p-4">
                      <div>
                        <img
                          src={ data.logo }
                          alt=""
                          className="h-16 w-36 object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 flex gap-3 justify-center">
                    <div>
                      <p className="text-small text-slate-300">{ data.title }</p>
                    </div>
                  </div>
                </div>
              </div>
            ) ) ) }
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationCardList;
