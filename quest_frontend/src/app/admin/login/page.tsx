"use client";
import { notify } from "@/utils/notify";
import axios from "axios";
// import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import React,{useState,useEffect} from "react";

type Props = {};

const LoginPage = (props: Props) => {
  const router=useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showpassword, setShowpassword] = useState(false);
    
    const handleSubmit=async()=>{
        try {
            const response= await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/login`,{email,password});
            // console.log(response);

            const data=response.data;
            
            if(response.status===200){
              notify("success",data.message);
              localStorage.setItem('token',data.token);
              router.push('/admin/dashboard');
            }

        } catch (error:any) {
            notify("error",error.response.data.message);
            console.log(`error while admin login ${error}`)
        }
    }

  return (
    <>
      <section className="bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 p-4">
            <div className="p-4  md:space-y-6 sm:p-8">
            <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">Admin Login</h1>
            </div>
            
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Login in to your account 
              </h1>
              <form className="space-y-4 md:space-y-6" action="#">
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <div className="flex justify-center items-center text-black">
                  <input
                    type={showpassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                  <button className="ml-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={() => setShowpassword(!showpassword)}>{showpassword ? "Hide" : "Show"}</button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                 
                  <a
                    href="#"
                    className="text-sm font-medium text-blue-500 hover:underline dark:text-primary-500"
                  >
                    Forgot password? Contact admin
                  </a>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    // console.log(email, password); 
                    handleSubmit();
                  }}
                  type="submit"
                  className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                    login
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginPage;
