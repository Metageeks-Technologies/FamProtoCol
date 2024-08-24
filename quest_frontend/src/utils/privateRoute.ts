"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export const useProtectedRoute = (requiredRole: 'user' | 'kol') => {
  const router = useRouter();
  const userRole = useSelector((state: RootState) => state.login.user?.role);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  useEffect(() => {
    if (userRole === null) {
      router.push('/login');  
    } else if (userRole !== requiredRole) {
      router.push('/home');  
    } else {
      setHasAccess(true);
    }
    setIsLoading(false);
  }, [userRole, requiredRole, router]);

  return { isLoading, hasAccess };
};
