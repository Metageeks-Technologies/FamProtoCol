"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { BallTriangle, TailSpin } from "react-loader-spinner";
import Link from "next/link";

type Props = {};

interface KolsData {
  _id:string;
  displayName: string;
  userName: string;
  role: string;
  bio: string;
  image: string;
  upVotes: number;
  downVotes: number;
}
interface ProfileProps
{
    _id:string;
    displayName: string;
    // quests: number;
    // followers: number;
    bio: string;
    image: string;
    // quest: any;
}

const Profile: React.FC<ProfileProps> = ( { _id,displayName, bio, image } ) =>
{

    return (
      <>
      <Link href={`/kol/kols-profile/${_id}`}>
        <div className='group flex flex-col gap-2 sm:flex-row border-[#333333] border p-4 w-full max-w-md bg-[#111111] text-white m-auto my-5 rounded-lg shadow-xl hover:bg-[#8c71ff] hover:text-[#000000]'>
            <div className='w-full sm:w-1/3 flex flex-col gap-2 items-center mb-4 sm:mb-0 justify-start'>
                <div className='h_image-container w-28 h-28 overflow-hidden rounded-sm'>
                    <img src={image} alt={displayName} className='h_styled-image object-cover' />
                </div>
                <div className='h_bg_Div_Down bg-gray-800 group-hover:bg-[#735dcf] ' />
                <div className="">
                 <div className="flex row gap-1">
                        <div className="box1 right-trapezium w-[2rem] h-[2rem] bg-[#ffffff33]">
                          <svg className="box2 right-trapezium p-2" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                            <path d="M12.5736 2.125H14.7461L10.0003 7.52604L15.5834 14.875H11.2115L7.78815 10.4175L3.87035 14.875H1.69577L6.7724 9.09854L1.41669 2.125H5.89902L8.99444 6.19933L12.5736 2.125ZM11.8115 13.5802H13.0156L5.24452 3.35183H3.95252L11.8115 13.5802Z" fill="white" />
                          </svg>
                        </div>
                        <div className="box1 left-right-trapezium w-[2rem] h-[2rem] px-2 bg-[#ffffff33]" >
                          <svg className="box2 left-right-trapezium p-2" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                            <path d="M13.6496 3.77537C12.7075 3.3362 11.6875 3.01745 10.625 2.83328C10.6157 2.83299 10.6064 2.83473 10.5978 2.83841C10.5893 2.84208 10.5816 2.84758 10.5754 2.85453C10.4479 3.08828 10.2991 3.39287 10.2 3.62662C9.07302 3.45662 7.92694 3.45662 6.79998 3.62662C6.70081 3.38578 6.55206 3.08828 6.41748 2.85453C6.4104 2.84037 6.38915 2.83328 6.3679 2.83328C5.3054 3.01745 4.29248 3.3362 3.34331 3.77537C3.33623 3.77537 3.32915 3.78245 3.32206 3.78953C1.3954 6.67245 0.864148 9.47745 1.12623 12.2541C1.12623 12.2683 1.13331 12.2825 1.14748 12.2895C2.42248 13.2245 3.6479 13.7912 4.85915 14.1666C4.8804 14.1737 4.90165 14.1666 4.90873 14.1525C5.19206 13.7629 5.44706 13.352 5.66665 12.92C5.68081 12.8916 5.66665 12.8633 5.63831 12.8562C5.23456 12.7004 4.85206 12.5162 4.47665 12.3037C4.44831 12.2895 4.44831 12.247 4.46956 12.2258C4.54748 12.1691 4.6254 12.1054 4.70331 12.0487C4.71748 12.0345 4.73873 12.0345 4.7529 12.0416C7.18956 13.1537 9.81748 13.1537 12.2258 12.0416C12.24 12.0345 12.2612 12.0345 12.2754 12.0487C12.3533 12.1125 12.4312 12.1691 12.5091 12.2329C12.5375 12.2541 12.5375 12.2966 12.5021 12.3108C12.1337 12.5304 11.7441 12.7075 11.3404 12.8633C11.3121 12.8704 11.305 12.9058 11.3121 12.927C11.5387 13.3591 11.7937 13.77 12.07 14.1595C12.0912 14.1666 12.1125 14.1737 12.1337 14.1666C13.3521 13.7912 14.5775 13.2245 15.8525 12.2895C15.8666 12.2825 15.8737 12.2683 15.8737 12.2541C16.1854 9.04537 15.3566 6.26162 13.6779 3.78953C13.6708 3.78245 13.6637 3.77537 13.6496 3.77537ZM6.03498 10.5612C5.3054 10.5612 4.69623 9.88828 4.69623 9.05953C4.69623 8.23078 5.29123 7.55787 6.03498 7.55787C6.78581 7.55787 7.38081 8.23787 7.37373 9.05953C7.37373 9.88828 6.77873 10.5612 6.03498 10.5612ZM10.9721 10.5612C10.2425 10.5612 9.63332 9.88828 9.63332 9.05953C9.63332 8.23078 10.2283 7.55787 10.9721 7.55787C11.7229 7.55787 12.3179 8.23787 12.3108 9.05953C12.3108 9.88828 11.7229 10.5612 10.9721 10.5612Z" fill="#8C71FF" />
                          </svg>
                        </div>
                        <div className="box1 left-trapezium w-[2rem] h-[2rem] bg-[#ffffff33]">
                          <svg className="box2 left-trapezium p-2" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                            <g clipPath="url(#clip0_213_2492)">
                              <path fillRule="evenodd" clipRule="evenodd" d="M5.40967 0.295777C3.95975 0.717526 2.67072 1.56676 1.71099 2.73255C0.751252 3.89834 0.165424 5.32648 0.0300293 6.83042H3.4586C3.65736 4.54191 4.32089 2.31799 5.4086 0.294706L5.40967 0.295777ZM3.4586 8.16971H0.0300293C0.165141 9.6737 0.750718 11.102 1.71027 12.268C2.66981 13.4339 3.95872 14.2834 5.4086 14.7054C4.32089 12.6821 3.65736 10.4582 3.4586 8.16971ZM7.12717 14.9915C5.82731 12.9316 5.03081 10.5946 4.80217 8.16971H10.1968C9.96817 10.5946 9.17167 12.9316 7.87182 14.9915C7.62375 15.0035 7.37524 15.0035 7.12717 14.9915ZM9.59146 14.7043C11.0412 14.2824 12.33 13.4331 13.2895 12.2673C14.249 11.1016 14.8347 9.67351 14.97 8.16971H11.5415C11.3427 10.4582 10.6792 12.6821 9.59146 14.7054V14.7043ZM11.5415 6.83042H14.97C14.8349 5.32643 14.2493 3.89815 13.2898 2.73216C12.3302 1.56618 11.0413 0.716705 9.59146 0.294706C10.6792 2.31798 11.3427 4.5419 11.5415 6.83042ZM7.12717 0.00863426C7.37559 -0.00352913 7.62446 -0.00352913 7.87289 0.00863426C9.17237 2.06857 9.9685 4.40557 10.1968 6.83042H4.80324C5.03574 4.39078 5.83396 2.05185 7.12717 0.00863426Z" fill="#FA00FF" />
                            </g>
                            <defs>
                              <clipPath id="clip0_213_2492">
                                <rect width="15" height="15" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                        </div>
                      </div>
                </div>
            </div>

            <div className='w-full sm:w-2/3 flex flex-col sm:pl-4 p-2'>
                <div className='flex flex-wrap items-center justify-evenly sm:justify-start mb-4'>
                    <div>
                    <h2 className='text-sm font-bold mb-2 text-start mr-7 mt-3 sm:text-left'>{ displayName }</h2>
                    </div>
                    <div className="flex flex-row gap-1">
                      <div className='text-center sm:text-right mr-3 text-sm'>
                        {/* <span className='block '>{ quest.length }</span> */}
                        <span className='opacity-40' >QUESTS</span>
                    </div>
                    <div className='text-start sm:text-right text-sm'>
                        {/* <span className='block'>{ followers }</span> */}
                        <span className='opacity-40 text-sm'>FOLLOWERS</span>
                    </div>
                </div>
                </div>
                <p className='text-xs p-2 mb-4 text-center sm:text-left group-hover:bg-[#735dcf]'>
                    <span >BIO: </span>
                    <span className='opacity-40 font-semibold justify-center'>
                        { bio }
                    </span>
                </p>
                <div className="mb-4">
                    <span className="text-xs text-gray-400 group-hover:text-black">VOTES</span>
                    <div className="mt-1 flex space-x-1">
                        { [ ...Array( 6 ) ].map( ( _, i ) => (
                            <div key={ i } className={ `h-1 w-full ${ i < 3 ? 'bg-purple-500' : 'bg-gray-700' }` }></div>
                        ) ) }
                    </div>
                </div>
            </div>
        </div>
        </Link>
      </>
    );
};

const RateKols = (props: Props) => {

  const [kols, setKols] = useState<KolsData[]>([]);
  const [loader,setloader]=useState(false);
  useEffect(() => {
    const fetchKols = async () => {
      setloader(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/kols/get`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const res = await response.json();
        setKols(res.kols);
        setloader(false);
      } catch (error) {
        console.error("Error fetching KOLs:", error);
      }
    };

    fetchKols();
  }, []);

  useEffect(() => {
    console.log(kols); // Log kols whenever it changes
  }, [kols]);
  return (
    <div className="min-h-screen w-[90%] mx-auto">

    <div className=" w-full bg-black min-h-screen">
     
      <div className="container  mx-auto mt-8">
      <div className="text-2xl  font-bold h-20 text-start text-white"
      >All the kols:</div>
      {loader?
      <div className="flex justify-center h-screen items-center">
        <TailSpin height="70" width="70"/>
      </div>
      :
      (
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4 p-2">
          {kols?.map((kol,index) => (
            <Profile key={ index } { ...kol } />
          ))}
      </div>
      )
      }
        
      </div>
    </div>
  </div>
  
  );
};

export default RateKols;
