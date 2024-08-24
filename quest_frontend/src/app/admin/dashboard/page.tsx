"use client";
import React,{useEffect} from 'react'
import {jwtDecode} from 'jwt-decode';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/navigation';



/*
admin task

1. add community types
2. add categories
3. add feed items
4. view user
5. view cols
6. vies community
7. add task
8. view task



*/


// Function to check if the token is valid
const isValidToken = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return false;
  }

  try {
    const decodedToken: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    // Check if token is expired
    if (decodedToken.exp < currentTime) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error decoding token:', error);
    return false;
  }
};


type Props = {}

const AdminDashboardPage = (props: Props) => {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      // Perform logout API call if needed (optional)
      // For example, if you want to invalidate the token on the server-side
  
      // Clear token from localStorage
      localStorage.removeItem('token');
  
      // Redirect to login page
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  

  useEffect(() => {
    if (!isValidToken()) {
      redirect('/admin/login'); // Redirect to login page if token is not valid
    }
  }, []);
  return (
      <div className=' h-screen'>
        <h2>dashboard page</h2>
      <div className='flex gap-5 items-center justify-center '>
      <div>
          View users
        </div>

        <div>
          View cols
        </div> 
        <div>
          view community
        </div>
      </div>

    </div>
  )
}

export default AdminDashboardPage



