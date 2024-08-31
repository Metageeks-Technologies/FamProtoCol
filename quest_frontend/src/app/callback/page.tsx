"use client";
import React, { Suspense,useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useRouter } from "next/navigation";

const CallBackPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const state = searchParams.get("state");
  const code = searchParams.get("code");
  console.log(state, code);

  const handleLogin = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/twitter/auth/callback?state=${state}&code=${code}`,
        {
          withCredentials: true,
        }
      );
      router.push("/");
      console.log(data);
    } catch (error) {
      router.push("/");
      console.log(error);
    }
  };

  useEffect(() => {
    handleLogin();
  }, []); // Ensure dependencies are set correctly

  return <div>Authenticating...</div>;
};

const CallBackPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallBackPageContent />
    </Suspense>
  );
};

export default CallBackPage;
