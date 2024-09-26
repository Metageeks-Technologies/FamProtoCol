"use client"
import { Spinner } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const Page = () => {
  const router = useRouter(); // Initialize router here
  router.push('/user/profile');

  return (
    <div className='bg-gray-500 items-center flex justify-center opacity-35 h-screen'> <Spinner color="success"/></div>
  );
};

export default Page;
