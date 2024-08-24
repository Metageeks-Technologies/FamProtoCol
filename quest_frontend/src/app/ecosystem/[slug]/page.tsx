"use client";
import { fetchAllCommunities } from '@/redux/reducer/communitySlice';
import {getCommunitySuccess} from '@/redux/reducer/adminCommunitySlice';
import { AppDispatch, RootState } from '@/redux/store';
import React, { useEffect } from 'react';
import CommunityCard from '@/app/components/HomeCard/CommunityCard';

import { useDispatch, useSelector } from 'react-redux';

const EcosystemPage = ( params: { params: { slug: any; }; } ) =>
{
    const dispatch = useDispatch<AppDispatch>();
    const eco = params.params.slug;
    // console.log( eco );
    const communityData = useSelector( ( state: any ) => state.adminCommunity );
    console.log( communityData );
    const ecosystem = communityData.ecosystems.slice( 0, 7 );
    const currentEcosystem = ecosystem.find( ( item: any ) => item.name === eco );
    console.log( currentEcosystem );
    const cardData = useSelector( ( state: any ) => state?.community?.allCommunities );

    // Filter the cardData based on ecosystem
    const data = cardData?.filter( ( item: any ) =>
    {
        // Check if item.ecosystem exists and is an array
        if ( Array.isArray( item.ecosystem ) )
        {
            // Check if eco is in the ecosystem array
            return item.ecosystem.includes( currentEcosystem?.name );
        } else if ( typeof item.ecosystem === 'string' )
        {
            // If ecosystem is a string, directly compare it
            return item.ecosystem === eco;
        }
        // If ecosystem is neither an array nor a string, return false
        return false;
    } );

    useEffect( () =>
    {
        dispatch( fetchAllCommunities() );
        dispatch( getCommunitySuccess() );
    }, [] );


    return (
        <div className=' pt-[5rem] w-[90%] mx-auto min-h-screen font-[ProFontWindows]'>
            <div className='flex-col lg:flex-row items-center flex justify-between md:gap-32 mb-16'>
                <div className='flex sm:w-2/5 flex-row text-xl items-center justify-around'>
                    <div className='p-3'>
                        <div
                            className='image-container h-[10rem] w-36 items-center flex'>
                            <img src={currentEcosystem?.imageUrl} alt='' className='styled-image ' />
                        </div>
                    </div>
                    <div className='flex w-[21rem]   m-1 flex-col  items-center'>
                        <div className='flex  flex-row items-center justify-between  w-full m-auto'>
                            <div className='text-4xl'>{currentEcosystem?.name}</div>
                            <div className='text-xs bg_Div_Container  bg-[#1d1a28] p-2 rounded-lg pl-6'>392K Participants</div>
                        </div>
                        <hr className="h-[1px] my-2  border-[0.5px] w-full border-dashed bg-black " />
                        <div className='flex  flex-row text-sm gap-2 justify-between w-full m-auto'>
                            <div className=' flex'>Desc: </div>
                            <div className=' text-wrap  text-gray-500'>Lorem ipsum, dolor sit amet consectetur adipisicing elitorem ipsu  </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-row text-gray-500 text-xl sm:w-3/5 justify-between bg-[#111111] shadow-lg shadow-[#0d0d0d] p-4 items-center'>
                    <div
                        className='bg_Div_half h-[10rem] w-[16rem] items-center flex'>
                        <img src='https://clusterprotocol2024.s3.amazonaws.com/others/Capa_1.png' alt='ecosystem' className='styled-image w-full h-full ' />
                    </div>

                    <div className='flex flex-col w-1/2  gap-3 p-2 justify-start   '>
                        <div className='text-sm flex flex-row gap-2 justify-between'>
                            <div>
                            <img src="https://clusterprotocol2024.s3.amazonaws.com/others/Capa_3.png" alt="Noob" />
                            </div>
                            <div className='text-white'>Noob :</div>
                            <div>+1 Quests</div>
                        </div>
                        <div className='text-sm flex flex-row gap-2 justify-between'>
                            <div><img src="https://clusterprotocol2024.s3.amazonaws.com/others/Capa_2.png" alt="Maxi" /></div>
                            <div className='text-white'>Maxi :</div>
                            <div>+2 Quests</div>
                        </div>
                        <div className='text-sm flex flex-row gap-2 justify-between'>
                        <div>
                        <img  src="https://clusterprotocol2024.s3.amazonaws.com/others/Capa_4.png" alt="Enthusiast" />
                        </div>
                            <div className='text-white'>Enthusiast :</div>
                            <div>+5 Quests</div>
                        </div>
                    </div>
                    <div className='text-right text-sm'>participate in quests in an ecosystem / cetegory in order to earn badges</div>
                </div>
            </div>
            <div className='my-16 w-full'>
            <svg xmlns="http://www.w3.org/2000/svg" height="2" viewBox="0 0 1082 2" fill="none">
                <path opacity="0.7" d="M1081 1L1.00001 1" stroke="url(#paint0_linear_148_4119)" stroke-linecap="round" stroke-dasharray="13 13"/>
                <defs>
                    <linearGradient id="paint0_linear_148_4119" x1="1081" y1="0.5" x2="1" y2="0.5" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#8C71FF" stop-opacity="0"/>
                    <stop offset="1" stop-color="#FA00FF"/>
                    </linearGradient>
                </defs>
            </svg>

            </div>

            {/* map the ecosytem */ }
            <div>
                <div className='text-white text-start mb-4 text-lg font-bold font-[ProFontWindows]'>{currentEcosystem?.name}  Communities : </div>
                 {!data || data?.length === 0 ? (
                <div className='flex items-center justify-center'>
                    <div className='flex flex-col items-center justify-center'>
                    <div><div className='text-white text-center text-lg font-[ProFontWindows]'>No Community Found</div></div>
                    <div><div><div className='text-white text-center text-lg font-[ProFontWindows]'>Add new Community with {eco} Ecosystem</div></div></div>
                    </div>
                    
                </div>
            ):(
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-7'>
                {data && data?.length > 0 && data?.map( ( item: any, index: number ) => (
                   <CommunityCard key={index} data={item} />
                ) ) }
            </div>
            )}
            </div>
        </div>
    );
};

export default EcosystemPage;
