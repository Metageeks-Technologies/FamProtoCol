"use client";
import type { Metadata } from "next";
import { useProtectedRoute } from "@/utils/privateRoute";
import { BallTriangle } from "react-loader-spinner";

export default function userLayout ( {
  children,
}: Readonly<{
  children: React.ReactNode;
}> )
{
  // const { isLoading } = useProtectedRoute( "kol" );
  // if ( isLoading )
  // {
  //   <div className="flex justify-center h-screen items-center">
  //     <BallTriangle />
  //   </div>;
  // } else
  // {
  //   // Render children if the role matches
  //   return <>{ children }</>;
  // }
  return <>{ children }</>;

}
