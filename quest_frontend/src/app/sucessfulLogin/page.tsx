"use client"

import { fetchUserData } from '@/redux/reducer/authSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { Spinner } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux';

const Page = () => {
  const router = useRouter(); // Initialize router here
  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector((state: RootState) => state.login?.user);
  // console.log(data)
  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  useEffect(() => {
    if (data?.role === 'kol') {
      router.push('/kol/kols-profile');
    } else if (data) {
      router.push('/user/profile');
    }
  }, [data, router]);
// console.log(data)

  return (
    <div className='bg-gray-500 items-center flex justify-center opacity-35 h-screen'> <Spinner color="success"/></div>
  );
};

export default Page;
