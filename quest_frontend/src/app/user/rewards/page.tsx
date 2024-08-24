import Badges from '@/app/components/badges'
import React from 'react'

const page = () => {
  return (
    <div className='bg-[#111111] pt-[5rem] md:pl-[5rem] flex flex-col h-full pb-5 font-[ProFontWindows]'>
      
      <div className='flex w-72 h-40  '>
          <div className=' box1 bg-[#282828]  div_reward'>
      <div className='    pb-0 box2 div_reward items-center justify-center bg-[#111111] flex text-gray-600    flex-col'>
        <div className='gap-x-9 pt-5 text-xs flex flex-1'>
           <div className='glass_small_div rounded-full p-3 glass_effect bg-[#f52eff3a] '>+25</div>
      <div>+45</div>
      <div>+35</div>
      </div>
      <div className="points">1,294,238 POINTS</div>
      <div>
      <div>+25</div>
      <div>+45</div>
      <div>+35</div>
      <div>+45</div>
      </div>
      </div>
       </div>
       
       </div>
       <div className='flex flex-col my-5 reward_quest justify-center w-full m-auto items-center md:flex-row' >
        <div className='text-xl md:text-4xl justify-end text-zinc-600'>
          Suggested Quests:
        </div>
      <div className='flex flex-row border-t border-white/10 border-b text-gray-500 text-xl p-3 w-[20rem] sm:w-[31rem] justify-between h-fit sm:h-32 bg-[#111111] shadow-lg shadow-[#0d0d0d]  items-center  m-auto'>      
            <div className='flex   flex-col  gap-5  w-full   '>
            <div className='text-sm   text-[#4d4d4d] flex flex-row gap-1 justify-between '> 
            <div className=''>#1</div>
            <div className='justify-start   w-[40%] px-2'><del> Connect Gitcoin</del></div>
            <div className='relative pt-2 w-full '>
            <div className="w-full h-1  opacity-25  bg-img   ">
              <div
                  className="   h-1  absolute"
                style={{ width: `${20}%` }}
              >
                  <div className="w-full  h-full    absolute " />
                  <div className="w-full h-full    absolute " />
 
              </div>
            </div>
            </div>
            <div className='text-[#cb03cf]   w-[25%]'>10 points</div>
            </div>
            <div className='text-sm   text-[#4d4d4d] flex flex-row gap-1 justify-between '> 
            <div className=''>#1</div>
            <div className='justify-start   w-[40%] px-2'><del> Connect Gitcoin</del></div>
            <div className='relative pt-2 w-full '>
            <div className="w-full h-1  opacity-25  bg-img   ">
              <div
                  className="   h-1  absolute"
                style={{ width: `${20}%` }}
              >
                  <div className="w-full  h-full    absolute " />
                  <div className="w-full h-full    absolute " />

              </div>
            </div>
            </div>
            <div className='text-[#cb03cf]   w-[25%]'>10 points</div>
            </div>
            <div className='text-sm   text-[#4d4d4d] flex flex-row gap-1 justify-between '> 
            <div className=''>#1</div>
            <div className='justify-start   w-[40%] px-2'><del> Connect Gitcoin</del></div>
            <div className='relative pt-2 w-full '>
            <div className="w-full h-1  opacity-25  bg-img   ">
              <div
                  className="   h-1  absolute"
                style={{ width: `${20}%` }}
              >
                  <div className="w-full  h-full    absolute " />
                  <div className="w-full h-full    absolute " />

              </div>
            </div>
            </div>
            <div className='text-[#cb03cf]   w-[25%]'>10 points</div>
            </div>
            
            </div>
            

         
        </div>
      </div>
    </div>
  )
}

export default page