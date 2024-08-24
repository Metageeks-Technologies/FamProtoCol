"use client";
import React, { useEffect } from "react";

const CallBackpage = () => {
  const getUser = async () => {
    try {
      const response = await fetch( `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/login/success`, {
        credentials: "include",
      });
      const data = await response.json();
      // console.log(data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getUser();
  }, []);
  return <div>page</div>;
};

export default CallBackpage;
