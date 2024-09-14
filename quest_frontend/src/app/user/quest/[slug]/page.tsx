"use client";
import Cookies from "js-cookie";
import QuizPollCarousel from "@/app/components/QuizPollCarousel";
import React, { useEffect, useState, useCallback } from "react";
import {
  fetchTaskById,
  completeTask,
  connetToWallets,
  fetchTasks,
} from "@/redux/reducer/taskSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { notify } from "@/utils/notify";
import { Button } from "@nextui-org/react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { ethers } from "ethers";
import { GITCOIN_PASSPORT_WEIGHTS } from "./stamp-weights";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header, StatusBar, NoTasks } from "@/app/components/quest/quest";
import {
  extractTeleGramChatId,
  getAcceptedFileTypes,
  getFileTypeInfo,
  validateFileType,
  isValidTweetUrl,
} from "@/utils/helper/helper";
import {
  CardData,
  Quest
} from "@/types/types";
import { SweetAlert } from "@/utils/sweetAlert";
import { fetchQuestById } from "@/redux/reducer/questSlice";
// types.ts
declare global {
  interface Window {
    ethereum?: any;
  }

  //using for type check
  type TaskType = {
    _id: string;
    connectedWallets?: string[];
    walletsToConnect?: number;
  };
}

const QuestPage: React.FC<{ params: { slug: string } }> = ({ params }) => {
  const dispatch: AppDispatch = useDispatch();
  const questId: string = params.slug;
  const [referral, setReferral] = useState<string>("Please Generate Referral");
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);

  const [submissions, setSubmissions] = useState<{
    [key: string]: string | File;
  }>({});
  const [progress, setProgress] = useState<any>(0);
  const [allTasksCompletedCalled, setAllTasksCompletedCalled] =
    useState<boolean>(false);

  const user = useSelector((state: RootState) => state.login.user);
  
  // console.log("user:-", user);
  const tasks = useSelector((state: RootState) => state.task.currentTask);
  useEffect(() => {
    dispatch(fetchTaskById(questId));
    dispatch(fetchTasks());
    dispatch(fetchQuestById(questId));
  }, [dispatch, questId]);

  useEffect(() => {
    const completedTasks = tasks.filter((task) => isTaskCompleted(task)).length;
    const progressPercentage = (completedTasks / tasks.length) * 100;

    setProgress(progressPercentage.toFixed(2));
    if (progressPercentage === 100 && !allTasksCompletedCalled) {
      handleAllTasksCompleted();
    }
  }, [tasks, allTasksCompletedCalled]);

  const quest=useSelector((state: RootState) => state.quest.quest);
  console.log("quest:-", quest);
  const handleCardClick = useCallback((card: CardData) => {
    setSelectedCard(card);
    setSubmissions({});
  }, []);

  const handleClosePopup = useCallback(() => {
    setSelectedCard(null);
    setSubmissions({});
  }, []);

  const handleSubmission = useCallback(
    async (taskId: string, submissionData?: { [key: string]: any }) => {
      try {
        let submission = submissionData || submissions[taskId];

        if (selectedCard?.type === "Opinion Scale") {
          submission = { opinionRating: submissionData?.opinionRating };
        }
        // console.log("submission from submission", submission);
        
        if (!validateSubmission(selectedCard?.type, submission)) {
          console.log(selectedCard);
          SweetAlert("error", "Invalid submission", "Please check your input");
          return;
        }

        if (
          selectedCard?.type === "File upload" &&
          submissions[taskId] instanceof File
        ) {
          const uploadSuccess = await handleUpload(submissions[taskId] as File);

          if (!uploadSuccess) {
            console.error("File upload failed");
            // notify("error", "File upload failed");
            SweetAlert("error", "File upload failed");
            return;
          }

          const uploadLink = `https://${
            process.env.NEXT_PUBLIC_S3_BUCKET_NAME
          }.s3.amazonaws.com/taskByUser/${(submissions[taskId] as File).name}`;
          submission = uploadLink;
        }

        const data = {
          taskId,
          userId: user?._id,
          userName: user?.displayName,
          submission: JSON.stringify(submission),
        };
        await dispatch(completeTask(data));
        dispatch(fetchTaskById(questId));
        handleClosePopup();
        // notify("success", "your rewards are added to your profile");
      } catch (error) {
        console.log("Error in completing the task:", error);
        SweetAlert("error", "An error occurred while submitting the task. Please try again.");
        // notify(
        //   "error",
        //   "An error occurred while submitting the task. Please try again."
        // );
      }
    },
    [dispatch, selectedCard, submissions, user]
  );

  const handleFileInputChange = useCallback((taskId: string, file: File) => {
    setSubmissions((prev) => ({ ...prev, [taskId]: file }));
  }, []);

  const validateSubmission = (
    taskType: string | undefined,
    submission: any
  ): any => {
    switch (taskType) {
      case "Text":
        return typeof submission === "string" && submission.trim().length > 0;
      case "Number":
        return !isNaN(Number(submission)) && submission !== "";
      case "URL":
        const urlPattern = /^(http)/;
        return urlPattern.test(submission);
      case "File upload":
        return submission instanceof File && submission.size > 0;
      case "Invites":
        return typeof submission === "string" && submission.trim().length > 0;
      case "Visit Link":
        return true;
      case "Poll":
      case "Quiz":
        return (
          typeof submission === "object" && Object.keys(submission).length > 0
        );
      case "Opinion Scale":
        return (
          typeof submission === "object" &&
          typeof submission.opinionRating === "string" &&
          submission.opinionRating >= 1 &&
          submission.opinionRating <= 5
        );
      case "Connect wallet":
        return true;
      case "Gitcoin passport":
        return true;
      case "Civic pass verification":
        return true;
      case "Ens holder":
        return true;
      case "Eth holder":
        return true;
      case "Connect multiple wallet":
        return true;
      case "Twitter Follow":
        return true;
      case "Tweet Like":
        return true;
      case "Tweet":
        return true;
      case "Tweet Retweet":
        return true;
      case "Telegram":
        return true;

      default:
        console.log("validation is complete, no matches found");
        return false;
    }
  };

  const handleGenerateReferral = useCallback(async () => {
    try {
      const formData = {
        userId: user?._id,
        questId,
        taskId: selectedCard?._id,
        expireDate: 5,
      };
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/task/get/referral`,
        formData,
        {
          withCredentials: true,
        }
      );
      setReferral(response.data);
    } catch (error) {
      console.error("Error generating referral:", error);
    }
  }, [user?._id, questId, selectedCard?._id]);

  const getUploadUrl = useCallback(async (fileName: string) => {
    if(!user || !user?._id) return;
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/aws/generate-upload-url`,
        {
          folder: 'taskByUser',
          fileName :`${user?._id}-${fileName}`,
        }
      );
      return response.data.url;
    } catch (error) {
      console.error("Error getting upload URL:", error);
      throw error;
    }
  }, []);

  const handleUpload = useCallback(
    async (file: File) => {
      if (!file) return false;
      try {
        const uploadUrl = await getUploadUrl(file.name);
        if (!uploadUrl) return false;
        const res = await axios.put(uploadUrl, file, {
          headers: { "Content-Type": file.type },
        });
        return res.status === 200;
      } catch (error) {
        console.log("Error uploading file:", error);
        return false;
      }
    },
    [getUploadUrl]
  );

  const handleInputChange = useCallback(
    (questionIndex: string, value: string) => {
      setSubmissions((prev) => ({ ...prev, [questionIndex]: value }));
    },
    []
  );

  const isTaskCompleted = useCallback(
    (task: CardData) => {
      return task.completions?.some(
        (completion) => completion?.user === user?._id
      );
    },
    [user?._id]
  );

  // Reward claim
  const handleAllTasksCompleted = useCallback(async () => {
    if (allTasksCompletedCalled) return;
    setAllTasksCompletedCalled(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/task/claim`,
        {
          userId: user?._id,
          questId,
        }
      );
      console.log("All tasks completed response:", response.data);
      // Reset the flag if you want to allow future calls
      // setAllTasksCompletedCalled(false);
    } catch (error) {
      console.error("Error making POST request for completed tasks:", error);
      setAllTasksCompletedCalled(false); // Reset on error to allow retry
    }
  }, [questId, user?._id, allTasksCompletedCalled]);

  return (
    <div className="bg-[#000000] text-white h-full ">
      <div className="mx-4 lg:mx-20 my-4 lg:my-10">
        <Header quest={quest as Quest } />
        {tasks.length > 0 ? (
          <>
            <StatusBar progress={progress} />
            <TaskCards
              tasks={tasks}
              isTaskCompleted={isTaskCompleted}
              onCardClick={handleCardClick}
            />
          </>
        ) : (
          <NoTasks />
        )}
      </div>
      {selectedCard && (
        <Popup
          selectedCard={selectedCard}
          isCompleted={isTaskCompleted(selectedCard)}
          submissions={submissions}
          onClose={handleClosePopup}
          onSubmit={handleSubmission}
          onFileInputChange={handleFileInputChange}
          onInputChange={handleInputChange}
          onGenerateReferral={handleGenerateReferral}
          referral={referral}
          validateSubmission={validateSubmission}
          questId={questId}
        />
      )}
    </div>
  );
};

const TaskCards: React.FC<{
  tasks: CardData[];
  isTaskCompleted: (task: CardData) => boolean;
  onCardClick: (task: CardData) => void;
}> = ({ tasks, isTaskCompleted, onCardClick }) => (
  <div className="grid gap-4 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pt-10 text-white">
    {tasks.map((task: CardData, index: number) => (
      <div
        key={task._id || index}
        className={`border cursor-pointer border-gray-200 bg-white/5 sm:p-2 lg:py-4 rounded-xl h-full w-full shadow-lg group hover:scale-105 hover:bg-white/10 ${
          isTaskCompleted(task) ? "opacity-50" : ""
        }`}
        onClick={() => onCardClick(task)}
      >
        <div className="flex gap-3 items-center justify-between mx-2">
          <div className="basis-[65%]">
            <h1 className="text-lg font-semibold text-gray-200 group-hover:text-white">
              {task.taskName.trim().length!=0?task.taskName:task.type}
            </h1>
            <p className="text-sm text-gray-400 truncate">
              {task?.taskDescription?.trim()?.length!=0?task.taskDescription: "Complete the task to earn rewards"}
            </p>
          </div>
          <div className="basis-[25%]">
            <div className="relative flex justify-center">
              <img
                src={task.image || "https://zealy.io/nstatic/xp-reward.webp"}
                alt="Task Image"
                className="w-full h-auto rounded-lg"
              />
              <div className="absolute w-full bottom-0 opacity-60 bg-purple-500 text-white px-2 text-sm flex justify-center">
                <p>{task?.category}</p>
              </div>
            </div>
          </div>
        </div>
        {isTaskCompleted(task) && (
          <div className="mt-2 text-green-400 text-sm">Completed</div>
        )}
      </div>
    ))}
  </div>
);

const Popup: React.FC<{
  selectedCard: CardData;
  isCompleted: boolean;
  questId: string;
  submissions: { [key: string]: string | File };
  referral: string;
  onGenerateReferral: () => void;
  onClose: () => void;
  onSubmit: (
    taskId: string,
    submissionData?: { [key: string]: string }
  ) => void;
  onFileInputChange: (taskId: string, file: File) => void;
  onInputChange: (questionIndex: string, value: string) => void;
  validateSubmission: (
    taskType: string | undefined,
    submission: any
  ) => boolean;
}> = ({
  selectedCard,
  isCompleted,
  submissions,
  onClose,
  onSubmit,
  onFileInputChange,
  onInputChange,
  onGenerateReferral,
  referral,
  validateSubmission,
  questId,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [address, setAddress] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState(3);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [localConnectedWallets, setLocalConnectedWallets] = useState<any>([]);
  const [stampArray, setStampArray] = useState<Array<Stamp>>([]);
  const user = useSelector((state: RootState) => state.login.user);
  const authToken = `Bearer ${Cookies.get("_fam_token")}`;

  const handleSubmit = () => {
    if (selectedCard.type === "Opinion Scale") {
      if (selectedValue) {
        onSubmit(selectedCard._id, { opinionRating: selectedValue.toString() });
      } else {
        notify("warn", "Please select a rating before submitting.");
      }
    } else if (
      validateSubmission(selectedCard.type, submissions[selectedCard._id])
    ) {
      onSubmit(selectedCard._id);
    } else {
      notify("warn", "Invalid input. Please check your submission.");
    }
  };

  // blockchain task
  useEffect(() => {
    if (selectedCard?.type === "Connect multiple wallet") {
      setLocalConnectedWallets(selectedCard?.connectedWallets);
    }

    // fetchData();
  }, [selectedCard]);

  // console.log("selectedCard:-", selectedCard);


  //Below line codes are using for to fetch the details form env for gitcoin api key, smart contract address and abi

  const APIKEY = process.env.NEXT_PUBLIC_GC_API_KEY; //API key for the access of gitcoin API
  const SCORERID = process.env.NEXT_PUBLIC_GC_SCORER_ID; //Scorer Id using to fectch the user score on behalf of stamp verification activity
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const contractABI = process.env.NEXT_PUBLIC_CONTRACT_ABI
    ? JSON.parse(process.env.NEXT_PUBLIC_CONTRACT_ABI)
    : null;

  // below line using for access gitcoin passport data and connectection
  const SUBMIT_PASSPORT_URI =
    "https://api.scorer.gitcoin.co/registry/submit-passport";
  const SIGNING_MESSAGE_URI =
    "https://api.scorer.gitcoin.co/registry/signing-message";

  const headers = APIKEY
    ? {
        "Content-Type": "application/json",
        "X-API-Key": APIKEY,
      }
    : undefined;

  interface Stamp {
    id: number;
    name: string;
    icon: string;
  }

  //Below codes are related to Metamask wallet connection
  useEffect(() => {
    if (
      selectedCard?.type === "Connect wallet" ||
      selectedCard?.type === "Gitcoin passport" ||
      selectedCard?.type === "Civic pass verification" ||
      selectedCard?.type === "Ens holder" ||
      selectedCard?.type === "Eth holder" ||
      selectedCard?.type === "Connect multiple wallet"
    ) {
      checkConnection();
    }
  }, []);

  const connectMultipleWallet = async () => {
    try {
      if (typeof window.ethereum === "undefined") {
        if (
          confirm(
            "MetaMask is not installed. Would you like to download it now?"
          )
        ) {
          window.open("https://metamask.io/download.html", "_blank");
        }
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const [accountAddress] = await provider.send("eth_requestAccounts", []);

      if (!accountAddress) {
        notify(
          "warn",
          "No Ethereum account connected. Please connect your wallet."
        );
        return;
      }

      if (selectedCard?.connectedWallets?.includes(accountAddress)) {
        notify("warn", "This wallet is already connected.");
        return;
      }

      const balance = await provider.getBalance(accountAddress);
      setBalance(ethers.formatEther(balance));

      // console.log("Wallet connected:", accountAddress);

      // Update the backend and refresh task data
      await Promise.all([
        dispatch(
          connetToWallets({
            taskId: selectedCard?._id,
            address: accountAddress,
          })
        ),
        dispatch(fetchTaskById(selectedCard?._id)),
      ]);

      // Update local state immediately
      setLocalConnectedWallets((prev: any) => [...prev, accountAddress]);

      // const connectedWalletsCount = Number(selectedCard?.connectedWallets?.length) ?? 0;
      const newConnectedWalletsCount = localConnectedWallets?.length + 1;
      if (newConnectedWalletsCount === selectedCard?.walletsToConnect) {
        onSubmit(selectedCard._id, { visit: "All required wallets connected" });
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      notify("error", "Failed to connect wallet. Please try again.");
    }
  };

  const checkConnection = async () => {
    if (typeof window.ethereum === "undefined") {
      // Prompt the user to install MetaMask and provide a link
      if (
        confirm("MetaMask is not installed. Would you like to download it now?")
      ) {
        // Open the MetaMask download page in a new tab
        window.open("https://metamask.io/download.html", "_blank");
      }
      return null;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      if (accounts && accounts[0]) {
        setAddress(accounts[0].address);
        const balance = await provider.getBalance(accounts[0].address);
        setBalance(ethers.formatEther(balance));
        await checkENS(accounts[0].address);
      }
    } catch (err) {
      console.log("Not connected...");
    }
  };

  const connectWallet = async (): Promise<string | null> => {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === "undefined") {
        // Prompt the user to install MetaMask and provide a link
        if (
          confirm(
            "MetaMask is not installed. Would you like to download it now?"
          )
        ) {
          // Open the MetaMask download page in a new tab
          window.open("https://metamask.io/download.html", "_blank");
        }
        return null;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);

      if (accounts.length === 0) {
        alert("No Ethereum account is connected. Please connect your wallet.");
        return null;
      }

      const accountAddress = accounts[0];
      setAddress(accountAddress);

      const balance = await provider.getBalance(accountAddress);
      setBalance(ethers.formatEther(balance));

      // Assuming checkENS is an async function that needs the account address
      await checkENS(accountAddress);

      // console.log("Wallet connected:", accountAddress);
      // onSubmit(taskId, { visited: "wallet connected" });

      return accountAddress;
    } catch (err) {
      console.log("Error connecting wallet:", err);
      return null;
    }
  };

  const connectSingleWallet = async (taskId: any): Promise<string | null> => {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === "undefined") {
        // Prompt the user to install MetaMask and provide a link
        if (
          confirm(
            "MetaMask is not installed. Would you like to download it now?"
          )
        ) {
          // Open the MetaMask download page in a new tab
          window.open("https://metamask.io/download.html", "_blank");
        }
        return null;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);

      if (accounts.length === 0) {
        alert("No Ethereum account is connected. Please connect your wallet.");
        return null;
      }

      const accountAddress = accounts[0];
      setAddress(accountAddress);

      const balance = await provider.getBalance(accountAddress);
      setBalance(ethers.formatEther(balance));

      // Assuming checkENS is an async function that needs the account address
      // await checkENS(accountAddress);

      // console.log("Wallet connected:", accountAddress);
      onSubmit(taskId, { visited: "wallet connected" });

      return accountAddress;
    } catch (err) {
      console.log("Error connecting wallet:", err);
      return null;
    }
  };

  const getSigningMessage = async () => {
    try {
      const response = await fetch(SIGNING_MESSAGE_URI, { headers });
      if (!response.ok) {
        throw new Error("Failed to fetch signing message");
      }
      return await response.json();
    } catch (err) {
      console.log("error: ", err);
    }
  };
  // Below codes are related to gitcoin passport submission
  const submitPassport = async (taskId: any) => {
    try {
      if (!address) {
        await connectWallet();
        console.log("user address is missing");
        return;
      }
      const { message, nonce } = await getSigningMessage();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(message);
      const response = await fetch(SUBMIT_PASSPORT_URI, {
        method: "POST",
        headers,
        body: JSON.stringify({
          address,
          scorer_id: SCORERID,
          signature,
          nonce,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to submit passport");
      }
      const data = await response.json();
      // console.log("data:", data);
      alert("Passport submitted successfully");
      onSubmit(taskId, { visited: "Passport verified" });
      getStamps();
      calculateGitcoinScore(); // Calculate score after stamps are fetched
    } catch (err) {
      console.log("error: ", err);
    }
  };

  const calculateGitcoinScore = () => {
    let score = 0;

    // console.log("Calculating Gitcoin score...");
    // console.log("Stamp array:", stampArray);
    // console.log("Gitcoin Passport Weights:", GITCOIN_PASSPORT_WEIGHTS);

    for (let i = 0; i < stampArray.length; i++) {
      const stampName = stampArray[i].name;
      // console.log(`Processing stamp: ${stampName}`);

      if (GITCOIN_PASSPORT_WEIGHTS.hasOwnProperty(stampName)) {
        try {
          const temp_score =
            GITCOIN_PASSPORT_WEIGHTS[
              stampName as keyof typeof GITCOIN_PASSPORT_WEIGHTS
            ];
          // console.log(`Adding ${temp_score} to score for stamp: ${stampName}`);
          score += temp_score;
        } catch (error) {
          console.log("Error adding element to cumulative score:", error);
        }
      } else {
        console.log(`Stamp ${stampName} not found in GITCOIN_PASSPORT_WEIGHTS`);
      }
    }

    // console.log("Final score:", score);
    setShowScore(true);
    setScore(score);
  };

  const Score = () => {
    return (
      <>
        <p> Your Gitcoin score is {score}</p>
      </>
    );
  };

  const getStamps = async () => {
    const stampProviderArray: Stamp[] = [];
    const GET_PASSPORT_STAMPS_URI = `https://api.scorer.gitcoin.co/registry/stamps/${address}?include_metadata=true`;

    try {
      const response = await fetch(GET_PASSPORT_STAMPS_URI, { headers });
      if (!response.ok) {
        throw new Error("Failed to fetch stamps");
      }

      const data = await response.json();
      let counter = 0;
      for (const item of data.items) {
        const stamp: Stamp = {
          id: counter,
          name: item.credential.credentialSubject.provider,
          icon: item.metadata.platform.icon,
        };
        stampProviderArray.push(stamp);
        counter += 1;
      }

      setStampArray(stampProviderArray);
      // console.log("Fetched stamps:", stampProviderArray);
    } catch (err) {
      console.log("Error fetching stamps:", err);
    }
  };

  const checkCivicPass = async (taskId: any) => {
    if (!contractAddress || !contractABI || !address) {
      await connectWallet();
      console.log("Contract address, ABI is missing");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      const result = await contract.verifyCivicPass();
      if (result) {
        // console.log("User has a valid Civic Pass.");
        // Proceed with the action
        onSubmit(taskId, { visited: "Civic Pass Verified" });
      }
    } catch (error) {
      console.error("User does not have a valid Civic Pass:", error);
      if (
        confirm(
          `You do not have a valid Civic Pass verification. Would you like to visit the Civic Pass verification site?`
        )
      ) {
        window.open("https://civic.me/", "_blank");
      }
    }
  };

  //Below codes are using to checkENS on connected user address, if user address hold any ENS then he will be able to proceed with action
  const checkENS = async (taskId: any) => {
    try {
      if (!address) {
        await connectWallet();
        if (!address) {
          // Re-check address after attempting to connect
          console.log("User address is still missing");
          return;
        }
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const ensName = await provider.lookupAddress(address); // Use 'address' instead of 'userAddress'
      if (ensName) {
        console.log(`ENS name found: ${ensName}`);
        onSubmit(taskId, { visited: "User address holds ENS" });
      } else {
        // Use a confirm dialog instead of alert
        const userConfirmed = window.confirm(
          "No ENS name found. Would you like to visit the ENS domain services to register an ENS name?"
        );
        if (userConfirmed) {
          window.open("https://app.ens.domains/", "_blank");
        }
        console.log("No ENS name found");
      }
    } catch (err) {
      console.log("Error checking ENS:", err);
    }
  };

  //Below codes are using to checkETH balance on connected user address, if user address hold any amount of ETH then he will be able to proceed with action
  const checkETHBalance = async (taskId: any) => {
    try {
      if (!address) {
        const connectedAddress = await connectWallet();
        if (!connectedAddress) {
          console.log("User address is still missing");
          return;
        }
      }
      if (parseFloat(balance) > 0) {
        // console.log(`ETH balance: ${balance}`);
        alert(`ETH balance: ${balance}`);
        onSubmit(taskId, { visited: "User address holds ETH" });
      } else {
        console.log("No ETH balance found");
        alert("Your account does not hold any ETH balance");
      }
    } catch (err) {
      console.log("Error checking ETH balance:", err);
    }
  };

  // discord
  const checkMembership = async () => {
    if (!user?.discordInfo?.discordId) {
      notify("error", "Please connect your discord account to proceed");
      router.push("/user/profile");
      return;
    }

    const data = user?.discordInfo?.discordId;
    const accessToken = user?.discordInfo?.accessToken;
    const guildId = selectedCard?.guild;
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/check-discord-membership`,
        {
          data,
          accessToken,
          guildId,
        }
      );
      // console.log("response:-", response.data);
      const discordShip = response.data.isMember;
      const datas = {
        taskId: selectedCard._id,
        userId: user?._id,
        userName: user?.displayName,
        submission: "Join Discord Successfully ",
      };
      // console.log("discordShip:-", discordShip);
      if (discordShip) {
        // console.log("Join Successful");
        // notify("success", "Join Successful");
        await dispatch(completeTask(datas));
        onClose();
        dispatch(fetchTaskById(questId));
      } else {
        notify("error", "Please join. Not a member");
      }
    } catch (error) {
      console.error("Error checking Discord membership:", error);
    }
  };

  // twitter task

  const handleCheckTwitterFollow = async (userName: string) => {
    try {
      if (!user?.twitterInfo?.accessToken) {
        notify("error", "Please connect your twitter account to proceed");
        router.push("/user/profile");
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/twitter/checkFollow`,
        {
          targetUserName: userName,
        },
        { withCredentials: true }
      );

      if (!response.data.success) {
        notify("error", response.data.message);
        return;
      }

      // console.log("follow response", response.data);
      return;
    } catch (error: any) {
      console.log("error while checking twitter follow", error);
      notify("error", error.message);
      return;
    }
  };

  const handleVerifyLike = async (tweetUrl: string) => {
    if (!user?.twitterInfo?.accessToken) {
      notify("error", "Please connect your twitter account to proceed");
      router.push("/user/profile");
      return;
    }

    const { isValid, tweetId } = isValidTweetUrl(tweetUrl);

    if (!isValid) {
      notify("error", "Invalid tweet URL");
      return;
    }
    // console.log("tweetId", tweetId);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/twitter/checkLike`,
        { tweetId },
        { withCredentials: true }
      );
      // console.log("like response", response.data);

      if (!response.data.success) {
        // notify("error", "Some error occured while checking tweet retweet");
        SweetAlert("error", "Some error occured while checking tweet retweet");
        return;
      }

      if (response.data.isLiked) {
        // notify("success", "You have liked the tweet");
        onSubmit(selectedCard._id, { visited: "Tweet liked" });
      } else {
        notify("error", "You have not liked the tweet");
      }
    } catch (error) {
      console.log("error while checking tweet like", error);
      SweetAlert("error", "Error while checking tweet like");
      // notify("error", "Error while checking tweet like");
    }
  };

  const handleVerifyRetweet = async (tweetUrl: string) => {
    if (!user?.twitterInfo?.accessToken) {
      notify("error", "Please connect your twitter account to proceed");
      router.push("/user/profile");
      return;
    }

    const { isValid, tweetId } = isValidTweetUrl(tweetUrl);
    if (!isValid) {
      notify("error", "Invalid tweet URL");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/twitter/checkRetweet`,
        { tweetId },
        { withCredentials: true }
      );

      if (!response.data.success) {
        // notify("error", "Some error occured while checking tweet retweet");
        SweetAlert("error", "Some error occured while checking tweet retweet");
        return;
      }

      if (response.data.isRetweeted) {
        // notify("success", "Task completed successfully");
        onSubmit(selectedCard._id, { visited: "Tweet retweeted" });
      } else {
        // notify("error", "You have not Retweeted the tweet");
        SweetAlert("error", "You have not Retweeted the tweet");
      }
    } catch (error) {
      console.log("error while checking tweet like", error);
      // notify("error", "Error while checking tweet like");
      SweetAlert("error", "Error while checking tweet like");
    }
  };

  const handleSendTweet = async (tweetBody: string) => {
    if (!user?.twitterInfo?.accessToken) {
      notify("error", "Please connect your twitter account to proceed");
      router.push("/user/profile");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/twitter/send`,
        { tweetBody },
        { withCredentials: true }
      );

      if (!response.data.success) {
        // notify("error", "Some error occured while sending tweet");
        SweetAlert("error", "Some error occured while sending tweet");
        return;
      }

      onSubmit(selectedCard._id, { visited: "Tweet sent" });
      // notify("success", "Tweet sent successfully");
    } catch (error) {
      console.log("error while sending tweet", error);
      SweetAlert("error", "Error while sending tweet");
      // notify("error", "Error while sending tweet");
    }
  };

  // telegram task
  const handleVerifyJoinTelegramGroup = async (groupUrl: string) => {
    if (!user?.teleInfo?.telegramId) {
      notify("error", "Please connect your telegram account to proceed");
      router.push("/user/profile");
      return;
    }
    try {
      const { status, chatId } = extractTeleGramChatId(groupUrl);
      if (!status) {
        // notify("error", "Invalid Telegram group URL");
        SweetAlert("error", "Invalid Telegram group URL");
        return;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/telegram/getChatMember?chat_id=${chatId}&user_id=${user?.teleInfo?.telegramId}`,
        {
          headers: {
            Authorization: authToken,
          },
          withCredentials: true,
        }
      );

      if (!response.data.success) {
        // notify("error", response.data.message);
        SweetAlert("error", response.data.message);
        return;
      }
      onSubmit(selectedCard._id, { visited: "Telegram group joined" });
    } catch (error) {
      console.log("error while checking telegram group", error);
      SweetAlert("error", "Error while checking telegram group");
      // notify("error", "Error while checking telegram group");
    }
  };

  const handleVisitLink= async (selectedCard:CardData) => {
      window.open(selectedCard.visitLink, "_blank");
      onSubmit(selectedCard._id, { visited: "true" });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative p-4 w-full max-w-md">
        <div className="relative bg-[#282828] rounded-3xl shadow text-white">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <div className="flex items-center">
              <div className="mx-2">
                <h3 className="text-lg font-semibold text-white capitalize ">
                {selectedCard.taskName.trim().length!=0?selectedCard.taskName:selectedCard.type}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-4 md:p-5">
            {isCompleted ? (
              <div className="text-green-400 text-center py-4">
                You have already completed this task!
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-100 mb-4 capitalize ">
                  {(selectedCard.taskDescription.trim().length!=0)?selectedCard.taskDescription:"Complete the task below to earn Rewards"}
                </p>

                {selectedCard.type === "Visit Link" && (
                  <div className="flex justify-center items-center mb-2 ">
                    <button
                      className="text-white px-4 py-2 bg-famViolate hover:bg-famViolate-light rounded-full"
                      onClick={() =>{ handleVisitLink(selectedCard)}}
                    >
                      Visit this link
                    </button>
                  </div>
                )}

                {(selectedCard.type === "Poll" ||
                  selectedCard.type === "Quiz") && (
                  <QuizPollCarousel
                    selectedCard={selectedCard}
                    handleSubmit={(answers) =>
                      onSubmit(selectedCard._id, answers)
                    }
                  />
                )}

                {selectedCard.type === "Invites" && (
                  <div className="flex flex-col">
                    <p>Referral Code:</p>
                    <div className="flex justify-center items-center space-x-2 my-2">
                      <input
                        type="text"
                        value={referral}
                        readOnly
                        className="text-xl font-bold bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 w-full"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(referral);
                          notify(
                            "default",
                            "Referral code copied to clipboard!"
                          );
                        }}
                        className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors duration-300"
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
                    </div>
                    <button
                      className="p-2 rounded-2xl bg-purple-600 text-white px-4 m-3 hover:bg-purple-700 transition-colors duration-300"
                      onClick={onGenerateReferral}
                    >
                      Generate Referral
                    </button>
                  </div>
                )}

                {selectedCard.type === "File upload" && (
                  <div>
                    {selectedCard.uploadFileType && (
                      <p className="text-sm text-gray-300 mb-2">
                        Please upload a {selectedCard?.uploadFileType} file.
                        Accepted formats:{" "}
                        {getFileTypeInfo(selectedCard.uploadFileType)}
                      </p>
                    )}
                    <input
                      type="file"
                      className="w-full p-2 border rounded-lg mb-2 bg-[#282828]"
                      accept={getAcceptedFileTypes(
                        selectedCard?.uploadFileType
                      )}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (
                            validateFileType(file, selectedCard?.uploadFileType)
                          ) {
                            onFileInputChange(selectedCard._id, file);
                          } else {
                            alert(
                              `Please upload a valid ${selectedCard.uploadFileType} file.`
                            );
                          }
                        }
                      }}
                    />
                  </div>
                )}

                {(selectedCard.type === "Text" ||
                  selectedCard.type === "Number") && (
                  <input
                    type={`${selectedCard.type.toLowerCase()}`}
                    className="w-full p-2 border rounded-lg mt-2 bg-[#282828]"
                    placeholder={`Please Enter ${selectedCard.type}`}
                    value={(submissions[selectedCard._id] as string) || ""}
                    onChange={(e) =>
                      onInputChange(selectedCard._id, e.target.value)
                    }
                  />
                )}

                {selectedCard.type === "URL" && (
                  <input
                    type="url"
                    className="w-full p-2 border rounded-lg mt-2 bg-[#282828]"
                    placeholder="https://"
                    // value={ submissions[ selectedCard._id ] as string || '' }
                    onChange={(e) =>
                      onInputChange(selectedCard._id, e.target.value)
                    }
                  />
                )}

                {selectedCard.type === "Opinion Scale" && (
                  <div className="flex flex-col mt-4 bg-gradient-to-br from-indigo-800 via-purple-700 to-pink-600 p-8 rounded-2xl shadow-2xl">
                    <h2 className="text-2xl text-white font-bold mb-4 text-center">
                      {selectedCard?.opinionQuestion}
                    </h2>
                    <p className="text-sm text-gray-200 mb-6 text-center">
                      Drag the slider or click a number to rate your opinion
                    </p>
                    <div className="relative mb-8">
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={selectedValue || 3}
                        onChange={(e) =>
                          setSelectedValue(Number(e.target.value))
                        }
                        className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between mt-2">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button
                            key={value}
                            className={`w-10 h-10 rounded-full text-lg font-bold transition-all duration-300 ease-in-out transform hover:scale-110
              ${
                selectedValue === value
                  ? "bg-white text-indigo-600 scale-125 shadow-lg"
                  : "bg-indigo-400 text-white hover:bg-indigo-300"
              }`}
                            onClick={() => setSelectedValue(value)}
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-300 font-medium">
                      <span>Strongly Disagree</span>
                      <span>Strongly Agree</span>
                    </div>
                    <div className="mt-8 text-center">
                      <p className="text-xl text-white font-semibold mb-2">
                        Your Rating
                      </p>
                      <div className="text-5xl text-white font-bold animate-pulse">
                        {selectedValue || "-"}
                      </div>
                    </div>
                  </div>
                )}

                {selectedCard.type === "Discord" && (
                  <div className="flex flex-col">
                    <div className="flex justify-center items-center">
                      <Button
                        onClick={() => {
                          window.open(selectedCard.discordLink, "_blank");
                        }}
                        className="text-white px-4 py-2 bg-famViolate hover:bg-famViolate-light rounded-full"
                      >
                        Join Server
                      </Button>
                    </div>
                    <div className="flex justify-end items-center">
                      <button
                        onClick={() => checkMembership()}
                        className="text-white px-2 py-1 bg-famViolate hover:bg-famViolate-light rounded-full "
                      >
                        Claim
                      </button>
                    </div>
                  </div>
                )}

                {selectedCard.type === "Telegram" && (
                  <div className="flex flex-col mb-4">
                    <div className="mb-4 text-start text-white">
                      Join the telegram group{" "}
                    </div>

                    <Link
                      target="_blank"
                      href={selectedCard?.telegramGroupLink as string}
                      className="rounded-full px-4 py-2 bg-blue-500 text-white mb-4"
                    >
                      <div className="flex justify-center items-center gap-2">
                        <span>
                          <i className="bi bi-telegram"></i>
                        </span>
                        <span>join The Group</span>
                      </div>
                    </Link>
                    <div className="flex justify-end items-center mb-2">
                      <button
                        onClick={() => {
                          handleVerifyJoinTelegramGroup(
                            selectedCard?.telegramGroupLink as string
                          );
                        }}
                        className="bg-blue-600 px-4 py-2 rounded-full "
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                )}

                {/* tweeter tasks start */}
                {selectedCard.type === "Tweet Like" && (
                  <div className="flex flex-col mb-4">
                    <div className="mb-4 text-start text-white">
                      Like the Below tweet{" "}
                    </div>

                    <Link
                      target="_blank"
                      href={selectedCard?.tweetLikeUrl as string}
                      className="rounded-full px-4 py-2 bg-blue-500 text-white mb-4"
                    >
                      <div className="flex justify-center items-center gap-2">
                        <span>
                          <i className="bi bi-twitter"></i>
                        </span>
                        <span>Tweet</span>
                      </div>
                    </Link>
                    <div className="flex justify-end items-center mb-2">
                      <button
                        onClick={() => {
                          handleVerifyLike(
                            selectedCard?.tweetLikeUrl as string
                          );
                        }}
                        className="bg-blue-400 px-4 py-2 rounded-full "
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                )}

                {selectedCard.type === "Tweet Retweet" && (
                  <div className="flex flex-col mb-4">
                    <div className="mb-4 text-start text-white">
                      Retweet the Below tweet{" "}
                    </div>

                    <Link
                      target="_blank"
                      href={selectedCard?.tweetRetweetUrl as string}
                      className="rounded-full px-4 py-2 bg-blue-600 text-white mb-4"
                    >
                      <div className="flex justify-center items-center gap-2">
                        <span>
                          <i className="bi bi-twitter"></i>
                        </span>
                        <span>ReTweet</span>
                      </div>
                    </Link>
                    <div className="flex justify-end items-center mb-2">
                      <button
                        onClick={() => {
                          handleVerifyRetweet(
                            selectedCard?.tweetRetweetUrl as string
                          );
                        }}
                        className="bg-blue-700 px-4 py-2 rounded-full "
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                )}

                {selectedCard.type === "Tweet" && (
                  <>
                    <div className="flex flex-col ">
                       <div className="mb-4 text-start text-white">
                        Below Tweet will be posted on your twitter account
                    </div>
                      {selectedCard?.defaultTweet && (
                        <div className="flex flex-col">
                          <textarea
                            disabled
                            value={selectedCard?.defaultTweet}
                            className="w-full bg-gray-800 mb-4 rounded-md text-white p-2 border-1 border-gray-400"
                          ></textarea>

                          <div className="flex justify-end items-center ">
                            <button
                              onClick={() =>
                                handleSendTweet(
                                  selectedCard?.defaultTweet as string
                                )
                              }
                              className="px-4 py-1 rounded-full bg-blue-500 hover:bg-blue-800 text-white"
                            >
                              <div className="flex justify-center items-center gap-2">
                                <span>
                                  <i className="bi bi-twitter"></i>
                                </span>
                                <span>Tweet</span>
                              </div>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {selectedCard.type === "Twitter Follow" && (
                  <div>
                    <div className="flex justify-center items-center mb-4">
                      <Link
                        href={`https://twitter.com/intent/follow?screen_name=${selectedCard?.tweetUsername}`}
                        target="_blank"
                        className="text-white bg-blue-500 rounded-full px-4 py-2 "
                      >
                        <div className="flex justify-center items-center gap-2">
                          <span>
                            <i className="bi bi-twitter"></i>
                          </span>
                          <span>Follow {selectedCard?.tweetUsername}</span>
                        </div>
                      </Link>
                    </div>
                    <div className="flex justify-end items-center mb-4">
                      <button
                        className="px-4 py-2 rounded-full bg-blue-700 text-white"
                        onClick={() => {
                          handleCheckTwitterFollow(
                            selectedCard?.tweetUsername as string
                          );
                        }}
                      >
                        Claim
                      </button>
                    </div>
                  </div>
                )}
                {/* tweeter tasks end */}

                {/* blockchain tasks start */}
                {selectedCard.type === "Connect wallet" && (
                  <div className="flex justify-end items-center" >
                  <Button
                    variant="solid"
                    color="primary"
                    className="justify-center text-center "
                    onClick={() => connectSingleWallet(selectedCard._id)}
                  >
                    Connect your wallet
                  </Button>
                  </div>
                )}

                {/* {selectedCard.type === "Connect wallet" && address && balance && (
                    <div className="mt-4">
                      <p className="text-white">Address: {address}</p>
                      <p className="text-white">Balance: {balance} ETH</p>
                    </div>
                )} */}

                {selectedCard.type === "Connect multiple wallet" &&
                  [...Array(selectedCard.walletsToConnect)].map((_, index) => (
                    <div key={index}>
                      {localConnectedWallets[index] ? (
                        <div className="flex justify-between py-4">
                          <label htmlFor="">
                            Connected your wallet {index + 1}
                          </label>
                          <Button
                            variant="flat"
                            color="primary"
                            className="text-center justify-center"
                            disabled
                          >
                            Connected to wallet {index + 1}
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-between py-4">
                          <label htmlFor="">
                            Connect your wallet {index + 1}
                          </label>
                          <Button
                            onClick={connectMultipleWallet}
                            variant="solid"
                            color="primary"
                            className="text-center justify-center"
                          >
                            Connect to wallet {index + 1}
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}

                {selectedCard.type === "Gitcoin passport" && (
                   <div className="flex justify-end items-center" >
                  <Button
                    variant="solid"
                    color="primary"
                    className="justify-center text-center "
                    onClick={() => submitPassport(selectedCard._id)}
                  >
                    Submit Gitcoin passport
                  </Button>
                  </div>
                )}

                {selectedCard.type === "Gitcoin passport" && showScore && (
                 <div className="flex justify-end items-center" >
                  <Button
                    variant="solid"
                    color="primary"
                    className="justify-center text-center"
                    onClick={Score}
                  >
                    gitcoin score
                  </Button>
                  </div>
                )}

                {selectedCard.type == "Civic pass verification" && (
                   <div className="flex justify-end items-center" >
                  <Button
                    variant="solid"
                    color="primary"
                    className="justify-center text-center "
                    onClick={() => checkCivicPass(selectedCard._id)}
                  >
                    Verify the Civic pass
                  </Button>
                  </div>
                )}

                {selectedCard.type == "Ens holder" && (
                 <div className="flex justify-end items-center" >
                  <Button
                    variant="solid"
                    color="primary"
                    className="justify-center text-center "
                    onClick={() => checkENS(selectedCard._id)}
                  >
                    Verify the account
                  </Button>
                  </div>
                )}

                {selectedCard.type == "Eth holder" && (
                  <div className="flex justify-end items-center" >
                  <Button
                    variant="solid"
                    color="primary"
                    className="text-center justify-center "
                    onClick={() => checkETHBalance(selectedCard._id)}
                  >
                    Verify the account
                  </Button>
                  </div>
                )}
                {/* blockchain tasks end */}
                {(selectedCard.type === "Opinion Scale" ||
                  selectedCard.type === "File upload" ||
                  selectedCard.type === "Text" ||
                  selectedCard.type === "Number" ||
                  selectedCard.type === "URL") && (
                  <div className="flex justify-end items-center mt-2" >
                   <Button
                    variant="solid"
                    color="primary"
                    className=" "
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestPage;
