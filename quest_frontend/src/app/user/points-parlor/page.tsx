"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchUserData } from "@/redux/reducer/authSlice";
import { notify } from "@/utils/notify";
import contractAbi from "@/utils/abi/contract.json";
import { ethers } from "ethers";
import { GITCOIN_PASSPORT_WEIGHTS } from "./stamp-weights";
import axiosInstance from "@/utils/axios/axios";
import { SweetAlert } from '@/utils/sweetAlert';

interface FamTasks {
  name: string;
  description: string;
  image: string;
  action: string;
  famPoints: number;
  buttonText: string;
}

interface FamTasksSubmisson {
    connectWallets:string[],
    gitScore:string;
}

const tasks = [
  {
    name: "Connect Wallet",
    description:
      "Connect your Ethereum wallet to begin interacting with the decentralized platform.",
    image:
      "https://buffer.com/library/content/images/size/w1200/2023/10/free-images.jpg",
    action: "connectWallet",
    buttonText: "Connect Wallet",
    famPoints: 10,
  },
  {
    name: "Multiple Wallet Connect",
    description:
      "Connect multiple wallets to access a broader range of assets and interactions across Web3 applications.You will get points on every account you connect.",
    image:
      "https://buffer.com/library/content/images/size/w1200/2023/10/free-images.jpg",
    action: "multipleWalletConnect",
    buttonText: "Connect Multiple Wallet",
    famPoints: 15,
  },
  {
    name: "Gitcoin Passport Verification",
    description:
      "Verify your identity using Gitcoin Passport to participate in ecosystem grants and governance.",
    image:
      "https://buffer.com/library/content/images/size/w1200/2023/10/free-images.jpg",
    action: "gitcoinPassportVerification",
    buttonText: "Verify Gitcoin Passport",
    famPoints: 20,
  },
  {
    name: "Civic Pass Verification",
    description:
      "Complete Civic Pass verification to confirm your identity for trusted Web3 interactions.",
    image:
      "https://buffer.com/library/content/images/size/w1200/2023/10/free-images.jpg",
    action: "civicPassVerification",
    buttonText: "Verify Civic Pass",
    famPoints: 20,
  },
  {
    name: "ENS Holder",
    description:
      "Verify that you are an ENS domain holder to gain additional privileges on the platform.",
    image:
      "https://buffer.com/library/content/images/size/w1200/2023/10/free-images.jpg",
    action: "ensHolderVerification",
    buttonText: "Check ENS",
    famPoints: 25,
  },
  {
    name: "ETH Holder",
    description:
      "Confirm that you hold ETH in your wallet to unlock exclusive features and access within the platform.",
    image:
      "https://buffer.com/library/content/images/size/w1200/2023/10/free-images.jpg",
    action: "ethHolderVerification",
    buttonText: "Check ETH",
    famPoints: 30,
  },
];

const PointsParlor = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [progress, setProgress] = useState(0);
  const [completedTask, setCompletedTask] = useState<string[]>([]);
  const [activeTasks, setActiveTasks] = useState<FamTasks[]>([]);
  const user: any = useSelector((state: RootState) => state.login.user);
  console.log("user",user);
  useEffect(() => {
    if (user) {
      const percentage = (user.famTasks.length / tasks.length) * 100;
      setProgress(Math.round(percentage));

      setCompletedTask(user.famTasks);
    }
  }, [user]);

  console.log("user", user);
  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  const taskCompleted = async (task: FamTasks,accountAddress?:string) => {
    try {
      const response = await axiosInstance.post("/user/famTaskComplete", {
        task,accountAddress
      });

      if (response.data.success) {
        // notify("success", "task completed");
        SweetAlert("taskCompleted","Task Completed",`Congratulations! You've earned ${task.famPoints} FamPoints for completing the task!`);
        dispatch(fetchUserData());
      }
    } catch (error) {
      console.log("error:", error);
      notify("error", "internal server error");
    }
  };

  return (
    <div className="sm:pt-[5rem] w-[90%] mx-auto h-full pb-5 font-famFont ">
      <div className="flex-col  lg:flex-row items-center gap-y-10 py-5 flex justify-between">
        <div className="w-full flex flex-row sm:h-[7rem] h-fit items-center justify-around">
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
          <div className="flex w-full h-full pl-[5%]  points_main_div   flex-col font-famFont  ">
            <div className="flex flex-col sm:flex-row sm:items-center justify-start gap-x-5  w-full m-auto">
              <div className="sm:text-xl text-lg ">
                {user?.domain?.domainAddress}
              </div>
              <div className="flex flex-wrap gap-2">
                <span>
                  {user?.famTasks?.length}/{tasks.length}
                </span>
                <span className="sm:text-base text-sm text-gray-600">
                  Task completed
                </span>
              </div>
            </div>
            <div></div>
            <div className="text-center flex flex-col sm:flex-row justify-start w-full ">
              <div className="px-3 m-auto text-[#cb03cf] sm:text-base text-sm w-[30%] flex justify-start items-center sm:text-center bg-transparent ">
                Progress : {progress}%
              </div>
              <div className=" flex flex-col pt-3 relative w-full  ">
                <div className="w-full h-1   bg-[#212121]  ">
                  <div
                    className="bg-[#cb03cf]   h-1  absolute"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="w-full h-full bg-[#cb03cf] progress_bar_shadow    absolute " />
                    <div className="w-full h-full bg-[#cb03cf]   absolute " />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <hr className="h-[1px] my-12 items-center m-auto border-[0.5px] w-3/4 border-dashed bg-violet-800 " /> */}
      <div>
        <div className="text-white text-lg py-4 ">Fam Tasks</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
          {tasks &&
            tasks.map((task, index) => (
              <FamTaskCard
                key={index}
                task={task}
                taskCompleted={taskCompleted}
                completedTask={completedTask}
                famTasksSubmission={user.famTasksSubmisson}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default PointsParlor;

interface FamTaskCardProps {
  task: FamTasks; // Assume FamTasks is the type for the task object
  taskCompleted: (task: FamTasks,accountAddress?:string) => Promise<void>; // Define the function signature
  completedTask:string[];
  famTasksSubmission:FamTasksSubmisson;
}

const FamTaskCard: React.FC<FamTaskCardProps> = ({ task, taskCompleted,completedTask,famTasksSubmission}) => {
  const [address, setAddress] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const [score, setScore] = useState(0);
  const [activeTask,setActiveTask]=useState(true);
  const [stampArray, setStampArray] = useState<Array<Stamp>>([]);

  useEffect(()=>{
    if(completedTask.includes(task.action)){
      setActiveTask(false);
    }
  },[completedTask])

  const APIKEY = process.env.NEXT_PUBLIC_GC_API_KEY; //API key for the access of gitcoin API
  const SCORERID = process.env.NEXT_PUBLIC_GC_SCORER_ID; //Scorer Id using to fectch the user score on behalf of stamp verification activity
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const contractABI = contractAbi;

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

  useEffect(() => {
    checkConnection();
  }, []);

  const connectSingleWallet = async (): Promise<string | null> => {
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
      await taskCompleted(task);
      // console.log("Wallet connected:", accountAddress);

      return accountAddress;
    } catch (err) {
      console.log("Error connecting wallet:", err);
      return null;
    }
  };

   const connectMultipleWallets = async () => {
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

      if (famTasksSubmission.connectWallets?.includes(accountAddress)) {
        notify("warn", "This account is already connected.Please connect another account from metamask. ");
        return;
      }

      const balance = await provider.getBalance(accountAddress);
      setBalance(ethers.formatEther(balance));

      console.log("Wallet connected:", accountAddress);
      
      // Update the backend and refresh task data
      await taskCompleted(task,accountAddress);

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
        await checkENS();
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
      await checkENS();

      // console.log("Wallet connected:", accountAddress);
      // onSubmit(taskId, { visited: "wallet connected" });

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
  const submitPassport = async () => {
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
      // submit
      await taskCompleted(task);
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
    // setShowScore(true);
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

  const checkCivicPass = async () => {
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
        //  submit logic
        await taskCompleted(task);
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
  const checkENS = async () => {
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
        // submit logic here
        await taskCompleted(task);
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
  const checkETHBalance = async () => {
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
        // submit logic here
        await taskCompleted(task);
      } else {
        console.log("No ETH balance found");
        alert("Your account does not hold any ETH balance");
      }
    } catch (err) {
      console.log("Error checking ETH balance:", err);
    }
  };

  const handleTaskSubmit = async () => {
    if (task.action === "connectWallet") {
      connectSingleWallet();
    } else if (task.action === "multipleWalletConnect") {
      connectMultipleWallets();
    } else if (task.action === "gitcoinPassportVerification") {
      submitPassport();
    } else if (task.action === "civicPassVerification") {
      checkCivicPass();
    } else if (task.action === "ensHolderVerification") {
      checkENS();
    } else if (task.action === "ethHolderVerification") {
      checkETHBalance();
    }
  };

  return (
    <div className={`bg-zinc-950 border-1 ${!activeTask && "opacity-40"} border-gray-600 p-2`}>
      <div className="p-1 pb-0 box2 flex text-gray-600  flex-col">
        <div className="flex w-full  mb-2  p-2 py-1 items-center justify-between m-auto">
          <div className="flex flex-row gap-1">
            <img
              src="https://pbs.twimg.com/profile_images/1747564240763056128/QPfeZbcI_400x400.jpg"
              className="h-6 w-6 rounded-full object-cover"
              alt={task.name}
            />
            <p className="text-sm text-white font-famFont">{task.name}</p>
          </div>
          <div className="flex justify-end gap-2 item-center w-1/2 font-famFont">
            <div className="text-md text-center text-white">Fam Points</div>
            <div className="text-md text-famPurple ">{task.famPoints}</div>
          </div>
        </div>
        <div className="p-2 text-xs mb-4 font-famFont text-wrap text-white">
          {task.description}
        </div>
        <div className="flex justify-center items-center mb-2">
          <button
            disabled={!activeTask}
            onClick={handleTaskSubmit}
            className="bg-[#5538CE] text-white px-4 py-2 rounded-lg font-famFont"
          >
            {task.buttonText}
          </button>
        </div>
        <div
          className="items-center justify-center flex m-auto w-full text-white/30"
          style={{ letterSpacing: "11px" }}
        >
          . . . . . .
        </div>
      </div>
    </div>
  );
};
