"use client"

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { getCommunitySuccess } from '@/redux/reducer/adminCommunitySlice';

interface Data {
  _id: string;
  imageUrl: string;
  name: string;
}

const Page: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const ecosystems = useSelector( ( state: any ) => state.adminCommunity.ecosystems);
  // console.log(ecosystems)

  useEffect(() => {
    dispatch(getCommunitySuccess());
  }, [dispatch]);

  return (
    <div className="lg:ml-16 sm:mx-8 mx-5">
      <div className="flex items-center gap-1 mt-8 lg:mx-0 ">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="11" viewBox="0 0 16 11" fill="none">
          <path d="M1 1H6.48652L15 10" stroke="#FA00FF" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 5L11 10" stroke="#FA00FF" strokeLinecap="round" />
        </svg>
        <div>
          <p>Ecosystems</p>
        </div>
      </div>

      <div className="Main grid gap-4   grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 pt-6 ">
        {ecosystems?.map((item: Data) => (
          <div key={item._id} className="card p flex gap-1">
            <div className="card bg-black w-36 h-36 border border-gray-700 flex items-center justify-center relative">
              <div className="w-full h-full relative">
                <div className="absolute inset-0 bg-cover bg-center opacity-10"
                style={{ backgroundImage: 'url("https://s3-alpha-sig.figma.com/img/eebc/98f9/46df3b847cc86d00bc3d47e6ddc025ab?Expires=1722211200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Nn8tCydWYlztw5LeO6~MGdC~FDwI7x4fEcwjWM1fthGLhZveD1YLJlztwDRK0q3bU8oKzVSLF-LR0D9PEqDmMN008paLVgpYr-kQQ74~~w4lwkMAKF4VqfrZ3Lg87dKEA3ahwQ82g3Hq9FNwoGnedm0o7sYd1NBYTLG-vzORi-TxobqJ1mW22xowaVfKe1IAcepqR9fYaFW2MhChjkjznYAzBAWvdtB3~LPrDEHO3MzgEnco7PQvrA7OOUSpCPdVOarn2MiMksth33mBgRuoalUnC1eagivJ-eK-x4kzM5QTYIDVelFQ2PO5ZcWIm~CrK0n4IlXp0fSoN-Ge8kpohA__")'}}
                 ></div>
                <div className="relative flex items-center justify-center w-full h-full">
                  <img src={item.imageUrl} alt="Profile" className="w-16 h-16 object-cover rounded-full" />
                </div>
                <div className='text-center '>{item.name}</div>
              </div>
              <div className="absolute -bottom-1 -right-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="5" height="5" viewBox="0 0 4 4" fill="none">
                  <path d="M4 0.5L0.5 0.5L0.5 4" stroke="white" />
                </svg>
              </div>
            </div>

            <div className="icon flex flex-col justify-start gap-2 bg-white/10 h-28 w-8 icon-clip">
              { ["⭐", "🍎", "⬆️"].map((icon, index) => (
                <span key={index} className="text">
                  {icon}
                </span>
              ))}
            </div>
          </div>
        ))}
      
      </div>
    </div>
  );
}

export default Page;
