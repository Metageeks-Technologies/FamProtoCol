"use client";

// import type { Metadata } from "next"; 
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";


interface data {
  _id: number;
  title: string;
  description: string;
  imageUrl: string;
}

function FeedCard({ _id, title, description, imageUrl }: data) {
  const words = description.split(" ");
  const isLongContent =
    (window.innerWidth < 600 && words.length > 50) || words.length > 100;
  const maxWords = window.innerWidth < 700 ? 20 : 100;
  const shortDescription = isLongContent
    ? words.slice(0, maxWords).join(" ") + "..."
    : description;

  return (
    <div className='h-30 md:h-60 bg-white/15 hover:bg-white/25 hover:scale-x-105 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-1000 ease-in-out flex flex-col md:flex-row'>
      <div className='md:w-1/3 h-48 md:h-auto overflow-hidden'>
        <img
          className='w-full h-full object-cover'
          src={imageUrl}   
          alt={`image ${_id}`}
        />
      </div>              
      <div className='p-5 md:w-2/3 flex flex-col justify-between'>
        <div>
          <h3 className='text-2xl font-medium mb-3 text-center md:text-start'>
            {title}
          </h3>
          <p className='text-lg text-neutral-300 mb-2 line-clamp-3 '>{shortDescription}</p>
        </div>    
        <div className='mt-2 flex justify-start'>
          <Link
            href={`/feed/${_id}`}
            className='text-white hover:bg-gradient-to-br focus:ring-4 focus:outline-none bg-[#5865F2] shadow-sm hover:bg-gray-800 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2  '
              >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
}



export default function Feed() {
  interface Feed {
    _id: number;
    title: string;
    description: string;
    imageUrl: string;
    author: string;
    summary: string;
  }
  const [feedItems, setFeedItems] = useState<Feed[]>([]);
  const [ loading, setLoading ] = useState<Boolean>( true );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getFeeds = async () =>
  {
    try
    {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL }/feed`,{
        params: {
          page: currentPage,
          limit: 10, // Example limit
        },
     });
      setFeedItems(response.data.feeds);
      setTotalPages(response.data.totalPages);

      // console.log('feed items :-',response.data)
      setLoading(false)
    } catch (error) {
      console.log('error in getting feed :-',error)
    }
  };

  useEffect(() => {
    getFeeds();
  }, [currentPage]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };


  return (
    <div className='feed lg:mx-20'>
       <div className='lg:10 mt-6 mb-8'>
          <h2 className='lg:text-5xl  text-3xl text-center font-medium'>Daily Feeds</h2>
        </div>
      <div className='w-[90%] md:w-[85%] mx-auto px-4 py-8'>
        <div className='lg:mx-20 space-y-6'>
          {feedItems?.map((item) => (
            <FeedCard key={item._id} {...item} />     
          ))}
        </div>
        <div className='flex justify-center items-center gap-5 mt-8'>
          <button
            className='text-white bg-[#5865F2] rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-800'
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <div>{currentPage}</div>
          <button
            className='text-white bg-[#5865F2] rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-800'
            onClick={nextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}