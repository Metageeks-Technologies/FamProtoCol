"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import ModalForm from "@/app/components/ModalForm";
import { fetchUserData } from "@/redux/reducer/authSlice";
import type { Referrer, ReferredUser } from "@/types/types";
import UserTable from "@/app/components/table/userTable";
import { notify } from "@/utils/notify";
import { TailSpinLoader } from "@/app/components/loader";
import { ethers } from "ethers";
import { connectWallet } from "@/utils/wallet-connect"; // Import your wallet connect utility
import upgradeableContractAbi from "@/utils/abi/upgradableContract.json";
import Link from "next/link";
import axiosInstance from "@/utils/axios/axios";
import { useAccount, useWalletClient } from "wagmi";
import WalletConnectButton from "@/app/components/rainbowkit/button";
import { TailSpin } from "react-loader-spinner";

const referralColumns = [
  { name: "NAME", uid: "name" },
  { name: "EARNINGS", uid: "earnings" },
  { name: "FAMPOINTS", uid: "fampoints" },
  { name: "REFERRALCOUNT", uid: "referralCount" },
];

const referredColumns = [
  { name: "NAME", uid: "name" },
  { name: "EARNINGS", uid: "earnings" },
  { name: "FAMPOINTS", uid: "fampoints" },
  { name: "REFERRALCOUNT", uid: "referralCount" },
];

const ReferralProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [referrer, setReferrer] = useState<Referrer[]>([]);
  const [referredUsers, setReferredUsers] = useState<ReferredUser[]>([]);
  const [showReferral, setShowReferral] = useState(false);
  const baseReferralUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/?referralCode=`;
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [loaders, setLoaders] = useState({
    generateReferral: false,
  });
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const user: any = useSelector((state: RootState) => state.login.user);
  // console.log("user", user);

  useEffect(() => {
    if (address) {
      setIsWalletConnected(true);
    } else {
      setIsWalletConnected(false);
    }
  }, [address]);
  const [generatetedRefferalCode, setGeneratedReferalcode] = useState("");

  const onGenerateReferral = async () => {
    try {
      setLoaders({ ...loaders, generateReferral: true });
      // Fetch referral code from the backend
      const response = await axiosInstance.get("/user/generateRefferalCode");

      if (response.data.success) {
        const referralCode = response.data.referralCode;
        setGeneratedReferalcode(referralCode);
        // Notify the user about the successful generation

        // Connect the wallet if not already connected
        // const walletData = await connectWallet();
        if (!address) {
          setIsWalletConnected(false);
          notify(
            "error",
            "Please connect your wallet to generate a referral code."
          );
          setLoaders({ ...loaders, generateReferral: false });
          return;
        }
        // console.log("wallet address present");

        // Use ethers to connect to the smart contract
        if (!walletClient) {
          notify("error", "Failed to connect wallet.");
          setLoaders({ ...loaders, generateReferral: false });
          return;
        }
        // console.log("walletCLient", walletClient);

        const provider = new ethers.BrowserProvider(walletClient);
        const signer = await provider.getSigner();

        const contractAddress =
          process.env.NEXT_PUBLIC_UPGRADABLECONTRACT_ADDRESS!;
        const contractABI = upgradeableContractAbi;

        // Initialize contract instance
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        // Call createReferralCode on the smart contract
        const tx = await contract.createReferralCode(referralCode);
        await tx.wait();

        const res = await axiosInstance.post("/user/setReferralCode", {
          referralCode,
        });
        if (res.data.success) {
          notify("success", "Referral code generated and saved successfully!");
          dispatch(fetchUserData());
        } else {
          notify("error", "Failed to save referral code.");
          setLoaders({ ...loaders, generateReferral: false });
        }
      }
    } catch (error: any) {
      console.error("Error generating referral code:", error);
      notify("error", error.reason);
    }
    setLoaders({ ...loaders, generateReferral: false });
  };

  const getReferredUsers = async () => {
    try {
      const response = await axiosInstance.get("/user/referred");
      // console.log("referred users", response.data);
      setReferredUsers(response.data.referredUsers);
    } catch (error) {
      console.error(error);
    }
  };
  const getReferrerUser = async () => {
    try {
      const response = await axiosInstance.get("/user/leaderboard/referrer");
      // console.log("referrers", response);
      setReferrer(response.data.users);
    } catch (err) {
      console.log("error while fetching referrer:", err);
    }
  };

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  useEffect(() => {
    getReferredUsers();
    getReferrerUser();
  }, []);

  if (!user)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <TailSpinLoader />
      </div>
    );

  return (
    <>
      <div className="flex flex-col gap-2 py-4">
        <div className="flex justify-between sm:justify-end items-center gap-4 mb-4 md:mb-4 w-[90%] mx-auto">
          <div>
            <WalletConnectButton />
          </div>
          <Link
            href="/"
            className="bg-famViolate hover:bg-famViolate-light px-2 py-1 md:px-4 md:py-2 rounded-md font-famFont"
          >
            Go Back
          </Link>
        </div>
        {/* user info */}
        <section className="w-full md:w-[90%] lg:w-[80%] mx-auto mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start justify-between lg:pt-20 mx-4 lg:mx-10">
            {/* user info */}
            <div className="lg:w-2/5 w-full">
              <div className="flex flex-col lg:flex-row items-center gap-0 lg:gap-4">
                <div className="bottom-trapezium w-40 h-40 flex justify-center items-center">
                  {user ? (
                    <img
                      src={user.image}
                      alt="avatar photo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  )}
                </div>

                <div className="lg:w-[16rem] flex lg:justify-start items-start mt-6 lg:mt-1">
                  <div className=" flex flex-col items-start ">
                    <div className="flex flex-col justify-start items-start">
                      <div className="text-2xl font-famFont ">
                        {user?.displayName}
                      </div>
                      <div className="text-xl text-famPurple flex items-baseline justify-start mb-2">
                        {/* #{user?.rank} */}
                        <span>@</span>
                        <span className="font-famFont lowercase">
                          {user?.domain?.domainAddress}
                        </span>
                      </div>
                      <div>
                         <Link
                              target="_blank"
                               href={`https://twitter.com/intent/tweet?text=Internet Just got Evolved. Be a part of this revolution. \n Mint your domain with  ${process.env.NEXT_PUBLIC_CLIENT_URL}`}
                              className="text-sm text-white font-qanelas border border-gray-600 px-6 py-2 hover:shadow-md hover:border-famViolate hover:text-famViolate rounded-lg transition-colors duration-300"
                            >
                             Click to tweet
                            </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row items-start mt-4">
                {user && (
                  <div className="w-full">
                    <div className="w-full flex flex-col items-center lg:items-start justify-center md:justify-start">
                      <div className="max-w-40 flex flex-col justify-center items-center lg:justify-start lg:items-start gap-2 ">
                        <ModalForm />
                        {(!user.inviteCode ||
                          user.inviteCode.trim().length === 0) && (
                          <div>
                            <button
                              className="w-full mb-2 rounded-md bg-famViolate text-white text-nowrap px-4 py-2 hover:bg-famViolate-light transition-colors duration-300"
                              onClick={onGenerateReferral}
                            >
                              <div className="flex justify-center items-center gap-2">
                                {loaders.generateReferral && (
                                  <span>
                                    <TailSpin width={20} height={20} />
                                  </span>
                                )}
                                <span>Generate Referral</span>
                              </div>
                            </button>
                          </div>
                        )}
                      </div>
                      {user.inviteCode && (
                        <div className="flex justify-start gap-2 items-center my-2">
                          <div className="relative">
                            <input
                              type={showReferral ? "text" : "password"} // Toggles between text and password
                              value={baseReferralUrl + user.inviteCode}
                              readOnly
                              className="text-sm pr-8 font-famFont bg-zinc-950 text-white border border-gray-600 focus:border-famViolate-light rounded px-4 py-2 w-full"
                            />
                            <button
                              onClick={() => {
                                setShowReferral(!showReferral);
                              }}
                              className="absolute top-1/2 right-2 transform -translate-y-1/2 text-sm text-white hover:text-famViolate-light"
                            >
                              {showReferral ? (
                                <i className="bi bi-eye-slash"></i>
                              ) : (
                                <i className="bi bi-eye"></i>
                              )}
                            </button>
                          </div>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(
                                baseReferralUrl + user.inviteCode
                              );
                              notify(
                                "default",
                                "Referral code copied to clipboard!"
                              );
                            }}
                            className="bg-famViolate text-white p-2 rounded-lg hover:bg-famViolate-light transition-colors duration-300"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                          </button>
                          <div>
                            <Link
                              target="_blank"
                              href={`https://twitter.com/intent/tweet?text=Internet Just got Evolved. Be a part of this revolution \n referral link: ${
                                baseReferralUrl + user.inviteCode
                              }`}
                              className="rounded-lg ml-2 block bg-famViolate text-white px-4 py-2 hover:bg-famViolate-light transition-colors duration-300"
                            >
                              {" "}
                              Share on X{" "}
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* badges */}
            <div className="lg:w-3/5 w-full font-famFont ">
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="11"
                    viewBox="0 0 15 11"
                    fill="none"
                  >
                    <path
                      d="M0.5 1H5.98652L14.5 10"
                      stroke="#FA00FF"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5.5 5L10.5 10"
                      stroke="#FA00FF"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="listOfFriends">Referrer LeaderBoard</div>
                </div>
                <div>
                  <UserTable<Referrer>
                    data={referrer}
                    columns={referralColumns}
                    rowsPerPage={5}
                    noData="No Referrer available"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Referred User  */}
        <section className="lg:w-[60%] w-full mx-auto sm:mt-8 ">
          <div className="flex items-center gap-2 justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="11"
              viewBox="0 0 15 11"
              fill="none"
            >
              <path
                d="M0.5 1H5.98652L14.5 10"
                stroke="#FA00FF"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M5.5 5L10.5 10" stroke="#FA00FF" strokeLinecap="round" />
            </svg>

            <div className="listOfFriends font-famFont">
              People referred by you
            </div>
          </div>
          <div className="friendTable">
            <UserTable<ReferredUser>
              data={referredUsers}
              columns={referredColumns}
              rowsPerPage={5}
              noData="Share your referral link to your friends
                you will get 2.5 USDT for each friend you refer"
            />
          </div>
        </section>
      </div>
    </>
  );
};
export default ReferralProfile;
