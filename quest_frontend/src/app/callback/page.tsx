"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useRouter } from "next/navigation";

const CallBackPage = () => {
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
  React.useEffect(() => {
    handleLogin();
  }, []);

  return <div>Authenticating...</div>;
};

export default CallBackPage;