"use client";
import { useState, useRef, useEffect } from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
  Spinner,
} from "@nextui-org/react";
import { ethers } from "ethers";
import axiosInstance from "@/utils/axios/axios";
import axios from "axios";
import { notify } from "@/utils/notify";
import Swal from "sweetalert2";
import upgradeableContractAbi from "@/utils/abi/upgradableContract.json";
import usdt from "@/utils/abi/usdt.json";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NitroWidget from "@/app/components/nitroWidget/nitro";
import WalletConnectButton from "@/app/components/rainbowkit/button";
import { useAccount, useWalletClient } from "wagmi";
import { isAlphanumericWithHyphen } from "@/utils/helper/helper";
import { fetchUserData } from "@/redux/reducer/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";

const LandingPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [domain, setDomain] = useState<string>("");
  const [existingDomain, setExistingDomain] = useState<string[]>([]);
  const [isDomainAvailable, setIsDomainAvailable] = useState<string>("");
  const [referralCode, setReferralCode] = useState("");
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [loader, setLoader] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [hash, setHash] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logo, setLogo] = useState<any>(null);
  const [thankYou, setThankYou] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("login");
  const [isBridge, setIsBridge] = useState(false);
  const [isBridgeActive, setIsBridgeActive] = useState(false);
  const [referralType, setReferralType] = useState("");
  // const [walletXProvider, setWalletXProvider] = useState<any>(null);
  // const [walletX, setWalletX] = useState<WalletX>({
  //   address: "",
  // });

  const [loaders, setLoaders] = useState({
    connectWallet: false,
    login: false,
    generateReferral: false,
  });
  const router = useRouter();
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient(); // Get signer for transactions
  // console.log("wallet address from rainbow",address);

  useEffect(() => {
    notifyAlert("clear");
    setIsBridge(false);
  }, [address]);

  const notifyAlert = (type: string, message?: string) => {
    if (type === "success") {
      setAlertMessage(message || "");
      setError("");
    } else if (type === "error") {
      setAlertMessage("");
      setError(message || "");
    } else {
      setAlertMessage("");
      setError("");
    }
  };
  const fetchDomains = async () => {
    try {
      const response = await axiosInstance.get("/user/domains");
      if (response.data.success) {
        setExistingDomain(response.data.filteredDomain);
        // console.log(response.data.filteredDomain);
      } else {
        console.log("error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkReferral = async () => {
    try {
      const response: any = await axiosInstance.post("/user/isValidReferral", {
        referralCode,
      });
      // console.log("checkReferral", response);
      if (response.data.success) {
        if (response.data.isFreeReferral === true) {
          setReferralType("free");
          return "free";
        }
        if (response.data.isDiscountReferral) {
          setReferralType("discount");
          return "discount";
        }
      }
    } catch (error) {
      console.log("error:", error);
      return;
    }
  };

  useEffect(() => {
    fetchDomains();
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("referralCode");
      if (code) {
        setReferralCode(code);
        setActiveTab("signUp");
      }
    }
  }, []);

  useEffect(() => {
    handleValidDomain();
  }, [domain]);

  useEffect(() => {
    if(thankYou){
      dispatch(fetchUserData());
    }
  }, [dispatch]);

  const handleValidDomain = () => {
    if (domain.length < 3) {
      return;
    }
    const checkDomain = domain + ".fam";
    const isExistingDomain = existingDomain.includes(checkDomain);
    if (isExistingDomain) {
      setIsDomainAvailable("false");
      return;
    }
    setIsDomainAvailable("true");
  };

  const handleDomainChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    notifyAlert("clear");
    setDomain(event.target.value);
    setIsDomainAvailable("");

    if (domain.length < 3) {
      return;
    }

    // console.log("domain" , event.target.value + ".fam");
    // console.log("exiting domain",existingDomain);
    const checkDomain = event.target.value + ".fam";
    const isExistingDomain = existingDomain.includes(checkDomain);
    if (isExistingDomain) {
      setIsDomainAvailable("false");
      return;
    }
    setIsDomainAvailable("true");
    return;
  };

  const handleOpen = () => {
    setLoader(false);
    setDomain("");
    onOpen();
    setShowPasswordField(false);
    setPassword("");
    notifyAlert("clear");
    setThankYou(false);
    setIsBridge(false);
    setLogoPreview("");
  };

  const handleClose = () => {
    notifyAlert("clear");
    setReferralCode("");

    onClose();
  };

  const handleSignUpDomain = async () => {
    setLoader(true);
    notifyAlert("clear");
    if (!isAlphanumericWithHyphen(domain)) {
      notifyAlert("error", "Invalid username");
      setLoader(false);
      return;
    }
    const updatedDomain = domain + ".fam";
    // console.log(updatedDomain);
    if (!logo) {
      setLoader(false);
      notifyAlert("error", "Logo is required");
      return;
    }
    if (!["image/jpeg", "image/png", "image/jpg"].includes(logo.type)) {
      setLoader(false);
      notifyAlert("error", "Only JPEG, PNG,JPG images are allowed");
      return;
    }
    if (!password) {
      notifyAlert("error", "Password is required");
      return;
    }

    try {
      const uploadSuccess = await handleUpload();
      // console.log(uploadSuccess);
      if (!uploadSuccess) {
        setLoader(false);
        notifyAlert("error", "Failed to upload image");
        return;
      }

      const path = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.amazonaws.com/userProfile/${domain}`;
      const response = await axiosInstance.post("/user/signUpDomain", {
        domainAddress: updatedDomain,
        image: path,
        password: password,
        hashCode: hash,
        walletAddress: address as string,
        referralCode,
      });

      if (response.data.success) {
        // alert(response.data.message);
        notify("success", response.data.message);
        setLoader(false);
        setThankYou(true);
        handleClose();
        setShowPasswordField(true);
      }
    } catch (err: any) {
      console.log(err);
      notifyAlert("error", err.response.data.message);
      setLoader(false);
    }
  };

  const handleLoginDomain = async () => {
    setLoaders({ ...loaders, login: true });
    notifyAlert("clear");
    if (!isAlphanumericWithHyphen(domain)) {
      notifyAlert("error", "Invalid username");
      setLoaders({ ...loaders, login: false });
      return;
    }
    const updatedDomain = domain + ".fam";

    try {
      const response = await axiosInstance.post("/user/loginDomain", {
        domainAddress: updatedDomain,
        password,
      });

      if (response.data.success) {
        notify("success", response.data.message);
        handleClose();
        router.push("/user/referral/dashboard");
      }
    } catch (err: any) {
      console.log(err);
      notifyAlert("error", err.response.data.message);
    }
    setLoaders({ ...loaders, login: false });
  };

  const handleLoginWithWallet = async () => {
    try {
      setLoaders({ ...loaders, connectWallet: true });
      notifyAlert("clear");
      if (!address) {
        setLoaders({ ...loaders, connectWallet: false });
        notifyAlert("error", "Wallet is not connected");
        return;
      }
      const response = await axiosInstance.post("/user/loginDomain", {
        walletAddress: address,
      });

      // console.log("response", response.data);
      if (response.data.success) {
        notify("success", response.data.message);
        handleClose();
        router.push("/user/referral/dashboard");
      }
    } catch (error: any) {
      console.log(error);
      notifyAlert("error", error.response.data.message);
    }
    setLoaders({ ...loaders, connectWallet: false });
  };

  // await walletXProvider.request({
  //       method: 'disconnect',
  //       params: [{ userAddress }],
  //     });

  // const handleWalletXMint = async () => {
  //   const res = await window.walletx.request({
  //     method: "eth_sendTransaction",
  //     // The following sends an EIP-1559 transaction. Legacy transactions are also supported.
  //     params: [
  //       {
  //         // The user's active address.
  //         from: walletX.address,
  //         // Required except during contract publications.
  //         to: process.env.NEXT_PUBLIC_UPGRADABLECONTRACT_ADDRESS,
  //         // Only required to send ether to the recipient from the initiating external account.
  //         data: "0x092ca2d0000000000000000000000000c6e60b2e0a3bc5529fa521d173b1cf7d94fc0c43",
  //       },
  //     ],
  //   });
  //   console.log("mint walletx", res);
  // };

  const handleDomainMinting = async () => {
    setLoader(true);
    notifyAlert("clear");
    setIsBridge(false);
    // Validate domain name
    if (!domain || domain.length < 3) {
      notifyAlert("error", "Domain name must be at least 3 characters long");
      setLoader(false);
      return;
    }

    if (isDomainAvailable === "false") {
      notifyAlert("error", "Domain already exists");
      setLoader(false);
      return;
    }

    if (!isAlphanumericWithHyphen(domain)) {
      notifyAlert(
        "error",
        "Invalid Domain: The domain must contain only alphanumeric characters and hyphens. Spaces are not allowed"
      );
      setLoader(false);
      return;
    }

    if (!logo) {
      setLoader(false);
      notifyAlert("error", "Please upload logo");
      return;
    }

    if (!["image/jpeg", "image/png", "image/jpg"].includes(logo.type)) {
      setLoader(false);
      notifyAlert("error", "Only JPEG, PNG,JPG images are allowed");
      return;
    }

    if (!referralCode || referralCode.trim().length === 0) {
      setLoader(false);
      notifyAlert("error", "Invite Code Required");
      return;
    }

    if (!password) {
      setLoader(false);
      notifyAlert("error", "Password Required");
      return;
    }

    if (!address) {
      setLoader(false);
      notifyAlert("error", "Connect wallet first");
      return;
    }
   const referralDiscount= await checkReferral();
    setReferralType(referralDiscount as string);
    const updatedDomain = domain + ".fam";

    const ArbicontractAddress =
      process.env.NEXT_PUBLIC_UPGRADABLECONTRACT_ADDRESS!;
    const usdtContractAddress = process.env.NEXT_PUBLIC_USDT_CONTRACT_ADDRESS!;
    const contractABI = upgradeableContractAbi;
    const usdtABI = usdt;

    if (!ArbicontractAddress || !contractABI || !address) {
      notifyAlert("error", "Failed to connect wallet.");
      setLoader(false);
      return;
    }

    try {
      // const provider = new ethers.BrowserProvider(window?.ethereum);
      // const signer = await provider.getSigner();

      if (!walletClient) {
        notifyAlert("error", "Failed to connect wallet.");
        setLoader(false);
        return;
      }
      // console.log("walletCLient", walletClient);

      // Get the provider and signer
      const provider = new ethers.BrowserProvider(walletClient);
      // console.log("provider", provider);
      const signer = await provider.getSigner(); // Get signer from the provider
      // console.log("signer details", signer);
      // Initialize the contract instance
      const contract = new ethers.Contract(
        ArbicontractAddress,
        contractABI,
        signer
      );

      // console.log("contract", contract);
      // console.log("signer", signer.address);
      const add = await signer.getAddress();
      // console.log("add", add);

      const hasMinted = await contract.hasMintedDomain(
        await signer.getAddress()
      );
      // console.log("hasMinted", hasMinted);

      if (hasMinted) {
        notifyAlert("error", "Domain already minted with this wallet address");
        setLoader(false);
        return;
      }

      // Check if the user is whitelisted for free mint
      const isFreeMintWhitelisted = await contract.freeMintWhitelist(
        await signer.getAddress()
      );
      // console.log("is free", isFreeMintWhitelisted);
      // console.log("referral Type",referralType);

      if (isFreeMintWhitelisted && referralDiscount === "free") {
        // Call free mint function
        const tx = await contract.freeMintDomain(updatedDomain);
        // console.log("tx");
        await tx.wait();
        // console.log("tx1");
        notifyAlert(
          "success",
          `Domain ${updatedDomain} minted for free successfully`
        );
        setHash(tx.hash);
        setShowPasswordField(true);
      } else {
        // Check if the user is whitelisted for discount mint
        const isDiscountMintWhitelisted = await contract.discountMintWhitelist(
          await signer.getAddress()
        );

        if (isDiscountMintWhitelisted && referralDiscount==="discount" ) {
          // Discounted mint fee (2.5 USDT)
          const usdtAmountDiscount = ethers.parseUnits("2.5", 6); // 2.5 USDT with 6 decimals

          // Initialize USDT contract instance
          const usdtContract = new ethers.Contract(
            usdtContractAddress,
            usdtABI,
            signer
          );

          // Check the user's USDT balance
          const usdtBalance = await usdtContract.balanceOf(
            await signer.getAddress()
          );
          if (usdtBalance < usdtAmountDiscount) {
            notifyAlert("error", "Insufficient USDT balance.");
            setIsBridge(true);
            // nitro
            setLoader(false);
            return;
          }

          // Approve the discounted minting fee (2.5 usdt) for your contract
          const approveTxDiscount = await usdtContract.approve(
            ArbicontractAddress,
            usdtAmountDiscount
          );
          await approveTxDiscount.wait();

          // Call discount mint function
          const tx = await contract.discountMintDomain(
            updatedDomain
          );
          await tx.wait();
          notifyAlert(
            "success",
            `Domain ${updatedDomain} minted with discount successfully`
          );
          setHash(tx.hash);
          setShowPasswordField(true);
        } else {
          // Initialize usdt contract instance
          const usdtContract = new ethers.Contract(
            usdtContractAddress,
            usdtABI,
            signer
          );

          const ownerExits=await contract.referralOwners(referralCode);
          // console.log("referral owner",ownerExits);
          if(ownerExits==0x0000000000000000000000000000000000000000){
            notifyAlert("error", "Invalid Referral Code");
            setLoader(false);
            return;
          }
          // Check the user's usdt balance
          const usdtBalance = await usdtContract.balanceOf(
            await signer.getAddress()
          );
          const usdtAmount = ethers.parseUnits("5", 6); // 5 usdt with 6 decimals

          if (usdtBalance < usdtAmount) {
            notifyAlert("error", "Insufficient USDT balance.");
            setIsBridge(true);
            setLoader(false);
            return;
          }

          // Approve the minting fee (5 usdt) for your contract
          const approveTx = await usdtContract.approve(
            ArbicontractAddress,
            usdtAmount
          );
          await approveTx.wait();

          // Call mintDomainWithReferral function
          const tx = await contract.mintDomainWithReferral(
            updatedDomain,
            referralCode
          );
          await tx.wait();
          notifyAlert(
            "success",
            `Domain ${updatedDomain} minted successfully with referral`
          );
          setHash(tx.hash);
          setShowPasswordField(true);
        }
      }
    } catch (error: any) {
      // console.log("error", error);
      // console.log("error code", error.code);
      // console.log("error message", error.message);
      if (error.code === "CALL_EXCEPTION") {
        console.error(
          "Transaction failed due to a contract revert or failure."
        );
        if (error.reason) {
          console.error("Revert reason:", error.reason);
          notifyAlert("error", `Transaction failed: ${error.reason}`);
        } else if (error.data) {
          console.error("Revert data:", error.data);
          notifyAlert("error", `Transaction failed: ${error.data}`);
        } else {
          console.error("Missing revert data.");
          notifyAlert(
            "error",
            "Transaction failed: Check your balance or Try with some other address."
          );
        }
      } else if (error.code === "INSUFFICIENT_FUNDS") {
        notifyAlert(
          "error",
          "You have insufficient funds to complete this transaction."
        );
      } else if (error.code === "UNPREDICTABLE_GAS_LIMIT") {
        notifyAlert("error", "The gas limit could not be estimated.");
      } else if (error.code === "ACTION_REJECTED") {
        notifyAlert("error", "Request Rejected");
      } else if (error.code === "BAD_DATA") {
        // Show a custom error message to the user
        console.log(error.message);
        notifyAlert(
          "error",
          "Minting is only allowed on Arbitrum mainnet network.Please add Arbitrum mainnet network"
        );
      } else if (error && error.error) {
        console.error("Error message:", error.error.message);
        console.error("Error code:", error.error.code);
        console.error("Error details:", error.error);
        if (error.error.code == -32603) {
          notifyAlert("error", "Request Rejected");
        }
      } else {
        // Log generic error for other types
        console.error("Transaction failed with an unknown error:", error);
        notifyAlert(
          "error",
          "Transaction failed due to an unknown error.Try again later"
        );
      }
      setLoader(false);
    }
    setLoader(false);
  };

  const getUploadUrl = async (): Promise<string> => {
    try {
      const response = await axiosInstance.post("/aws/generate-upload-url", {
        folder: "userProfile",
        fileName: domain,
      });
      return response.data.url;
    } catch (error) {
      console.error("Error getting upload URL:", error);
      throw error;
    }
  };

  const handleUpload = async (): Promise<boolean> => {
    if (!logo) return false;
    // console.log(logo);
    try {
      const uploadUrl = await getUploadUrl();
      if (!uploadUrl) return false;

      const res = await axios.put(uploadUrl, logo, {
        headers: { "Content-Type": logo.type },
      });

      return res.status === 200;
    } catch (error) {
      console.error("Error uploading file:", error);
      return false;
    }
  };
  const comingSoon = () => {
    Swal.fire({
      title: "Coming Soon",
      text: "Website will be live soon. Stay tuned!",
      width: 500,
      padding: "2em",
      color: "white",
      background: "#171616",
    });
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // console.log( "file", file );
    if (file) {
      setLogo(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
        // setLogo( file );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleActiveTabChanged = () => {
    if (activeTab === "signUp") {
      setActiveTab("login");
    } else {
      setActiveTab("signUp");
    }

    setPassword("");
    setShowPasswordField(false);
    setDomain("");
    setLogoPreview("");
    setReferralCode("");
    setIsBridge(false);
    notifyAlert("clear");
  };

  const handleBridge = (state: boolean) => {
    notifyAlert("clear");
    setIsBridgeActive(state);
    setIsBridge(false);
  };

  const [isWalletConnected, setIsWalletConnected] = useState(false);
  //  const [loaders, setLoaders] = useState({
  //    generateReferral: false,
  //  });
  const [showReferral, setShowReferral] = useState(false);

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

  // const detectEip6963 = () => {
  //   const handleAnnounceProvider = (event: Event) => {
  //     const customEvent = event as CustomEvent;

  //     if (customEvent.detail.info.name === "WalletX") {
  //       setWalletXProvider(customEvent.detail.provider);
  //       // console.log(customEvent.detail.provider, "This is walletXProvider");
  //     }
  //   };

  //   window.addEventListener("eip6963:announceProvider", handleAnnounceProvider);
  //   window.addEventListener(
  //     "eip6963:announceProvider:walletx",
  //     handleAnnounceProvider
  //   );

  //   window.dispatchEvent(new Event("eip6963:requestProvider"));
  //   window.dispatchEvent(new Event("eip6963:requestProvider:walletx"));

  //   return () => {
  //     window.removeEventListener(
  //       "eip6963:announceProvider",
  //       handleAnnounceProvider
  //     );
  //     window.removeEventListener(
  //       "eip6963:announceProvider:walletx",
  //       handleAnnounceProvider
  //     );
  //   };
  // };

  // useEffect(() => {
  //   detectEip6963();
  // }, []);

  // const handleWalletX = async () => {
  //   try {
  //     const response = await walletXProvider.enable();
  //     console.log("response", response);
  //     setWalletX({ ...walletX, address: response[0] });
  //     console.log("walletX", walletXProvider);

  //     // const sign = await walletXProvider.request({
  //     //   method: "personal_sign",
  //     //   params: ["sign",response[0], "Example password"],
  //     // });
  //     // console.log("sign",sign);
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  // };

  const user: any = useSelector((state: RootState) => state.login.user);

  const baseReferralUrl = `${
    process.env.NEXT_PUBLIC_CLIENT_URL
  }/?referralCode=${user?.inviteCode || ""}`;

  return (
    <>
      <div className="landing-page h-screen">
        <div className="w-[90%] mx-auto pt-8 h-full ">
          <div className="flex flex-col justify-between items-center h-full">
            <div className="w-full flex md:flex-row flex-col-reverse md:justify-between items-center gap-3 ">
              <div className="flex items-center gap-1">
                <Link
                  target="_blank"
                  href="https://fam-protocol.notion.site/Fam-Protocol-Public-Data-Room-10f79f6230bb807d98c7f44992891959"
                  // onClick={() => comingSoon()}
                  className="text-[#FA00FF] cursor-pointer font-famFont "
                >
                  VIEW DOCUMENTATION
                </Link>
                <div className="mt-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="5"
                    height="8"
                    viewBox="0 0 5 8"
                    fill="none"
                  >
                    <path
                      d="M0.487305 7.48755L3.97475 4.0001L0.487305 0.512655"
                      stroke="#FA00FF"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-white opacity-30 font-famFont ">
                  SOCIAL MEDIA:
                </div>
                <div className="flex items-center gap-1">
                  {/* twitter */}
                  <Link target="_blank" href="https://x.com/famprotocol">
                    <div className="box1 right-trapezium bg-zinc-700 p-[1px]">
                      <div className="box2 right-trapezium p-2 bg-[#111111]">
                        <i className="bi bi-twitter-x"></i>
                      </div>
                    </div>
                  </Link>
                  {/* telegram */}
                  <Link target="_blank" href="https://t.me/FamProtocol">
                    <div className="box1 empty-left-trapezium bg-zinc-700 p-[1px]">
                      <div className="box2 empty-left-trapezium p-2 bg-[#111111]">
                        <i className="bi bi-telegram"></i>
                      </div>
                    </div>
                  </Link>
                  {/* <div className="box1 left-trapezium w-[2rem] h-[2rem] bg-[#ffffff33] p-[1px]">
                         <i className="bi bi-discord"></i>
                      </div> */}
                </div>
              </div>
            </div>
            <div className="h-full flex items-center justify-center ">
              <div className="flex items-center justify-center h-full text-white">
                {thankYou ? (
                  <div className="flex flex-col justify-center text-white items-center ">
                    <div className="text-center mb-4 font-bold text-lg">
                      Thank you for Registering your domain with us!{" "}
                    </div>
                    <div className="text-center mb-4 ">
                      Once the Tier 1 mint is complete, our Dapp will go LIVE.{" "}
                    </div>
                    <div className="flex justify-center  gap-4 items-start">
                      <Link
                        href="/user/referral/dashboard"
                        className="px-4 py-2 bg-famViolate rounded-lg "
                      >
                        Visit Profile
                      </Link>
                      {user && user.inviteCode ? (
                        <div className="flex justify-start gap-2 items-center">
                          <div className="relative">
                            <input
                              type={showReferral ? "text" : "password"} // Toggles between text and password
                              value={baseReferralUrl + user.inviteCode}
                              readOnly
                              className="text-sm pr-8 font-famFont bg-zinc-950 text-white border-1 border-gray-600 focus:border-famViolate-light rounded px-4 py-2 w-full"
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
                        </div>
                      ) : (
                        <div className="flex flex-col justify-start">
                          <button
                            className="px-4 py-2 bg-famViolate rounded-lg "
                            onClick={onGenerateReferral}
                          >
                            Invite & Earn
                          </button>
                          <p className="text-[12px]">
                            *Invite & Earn $2.5 per referral instantly.
                          </p>
                        </div>
                      )}

                      <div className="flex flex-col justify-start">
                        <Link
                          target="_blank"
                          href={`${
                            user && user.inviteCode
                              ? `https://twitter.com/intent/tweet?text=Internet Just got Evolved. Be a part of this revolution \n referral link: ${
                                  baseReferralUrl + user.inviteCode
                                }`
                              : ""
                          }`}
                          className="rounded-lg block bg-purple-600 text-white px-4 py-2 hover:bg-purple-700 transition-colors duration-300"
                        >
                          {" "}
                          Share on X{" "}
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="z-10 text-center max-w-3xl">
                    <div className="flex justify-center items-center gap-3 flex-wrap mb-2">
                      <div className="w-16 h-16">
                        <img
                          className="w-full h-full object-cover "
                          src="https://clusterprotocol2024.s3.amazonaws.com/website+logo/logo.png"
                          alt="fam protocol"
                        />
                      </div>
                      <div className="flex flex-col justify-start items-start">
                        <span className="text-4xl text-white font-famFont text-wrap">
                          FAM PROTOCOL
                        </span>
                      </div>
                    </div>
                    <div className="text-center text-2xl text-gray-300 font-famFont ">
                      Fam's Gonna Make It
                    </div>
                    <p className="mt-6 text-gray-400 leading-relaxed text-xl font-famFont ">
                      Community Owned Internet Protocol
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                      <Button
                        // onClick={() => comingSoon()}
                        onClick={() => handleOpen()}
                        className="bg-[#5538CE] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#6243dd] transition duration-300"
                      >
                        Get OnBoarded
                      </Button>
                      {/* <Button
                        onClick={() => comingSoon()}
                        // onClick={() => router.push("/home")}
                        className="bg-white text-black font-semibold py-2 px-6 rounded-lg hover:bg-gray-200 transition duration-300"
                      >
                        Explore
                      </Button> */}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        backdrop="blur"
        placement="center"
        shadow="sm"
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        size="xl"
        radius="none"
        isOpen={isOpen}
        className=" bg-[#0d0d0d34]"
        onClose={handleClose}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="text-white p-8 ">
                {isBridgeActive ? (
                  <div className="flex flex-col justify-center items-center">
                    <NitroWidget />
                    <div className="w-full text-sm flex justify-start items-center sm:px-6 opacity-55 mb-4">
                      Note: Bridge ETH to Arbitrum Chain
                    </div>
                    <button
                      onClick={() => {
                        handleBridge(false);
                      }}
                      className="font-qanelas rounded-lg px-4 py-2 bg-famViolate text-white "
                    >
                      Go Back
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col justify-center items-center  ">
                    <div className="text-2xl font-bold font-qanelas uppercase mb-6 md:mb-4 ">
                      Get OnBoarded
                    </div>
                    {activeTab === "signUp" ? (
                      <div className="flex gap-4 mb-4 md:flex-row flex-col justify-between items-center rounded-lg">
                        <div className="w-full md:w-1/3 flex justify-center items-center">
                          <div
                            className="bg-zinc-950 border border-gray-600 h-36 w-36 flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-300 hover:border-famViolate-light "
                            onClick={() => {
                              fileInputRef.current?.click();
                            }}
                          >
                            {logoPreview ? (
                              <img
                                src={logoPreview}
                                alt="Uploaded logo"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-center">
                                <img
                                  src="https://clusterprotocol2024.s3.amazonaws.com/others/gallery-add.png"
                                  alt="upload image"
                                />
                              </div>
                            )}
                          </div>
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleLogoUpload}
                            accept="image/*"
                            className="hidden"
                          />
                        </div>
                        <div className="flex flex-col justify-center gap-4">
                          <div className="flex gap-4 flex-row justify-between">
                            <div>
                              <label
                                htmlFor="domain"
                                className="uppercase text-sm font-famFont "
                              >
                                Setup Username / Domain
                              </label>
                              <input
                                type="text"
                                disabled={showPasswordField}
                                value={domain}
                                onChange={(e) => handleDomainChange(e)}
                                className="w-full bg-zinc-950 border-1 font-famFont border-gray-600 px-4 py-2 hover:border-famViolate-light"
                                name="domain"
                                placeholder="e.g. JohnDoe"
                              />
                              {domain && isDomainAvailable === "false" && (
                                <div className="text-red-600 font-famFont  text-xs text-end">
                                  Domain already exists
                                </div>
                              )}
                              {domain && isDomainAvailable === "true" && (
                                <div className="text-green-600 font-famFont  text-xs text-end">
                                  Domain available
                                </div>
                              )}
                            </div>
                            <div>
                              <label
                                htmlFor="inviteCode"
                                className="uppercase text-sm font-famFont "
                              >
                                Invite Code
                              </label>
                              <input
                                type="text"
                                value={referralCode}
                                onChange={(e) =>
                                  setReferralCode(e.target.value)
                                }
                                className="w-full bg-zinc-950 border-1 border-gray-600 font-famFont px-4 py-2 hover:border-famViolate-light"
                                name="inviteCode"
                                placeholder="Invite Code"
                              />
                            </div>
                          </div>
                          <div>
                            <label
                              htmlFor="password"
                              className="uppercase text-sm font-famFont "
                            >
                              Password
                            </label>
                            <div className="flex mb-4 bg-zinc-950 border-1 border-gray-600 justify-between items-center hover:border-famViolate-light">
                              <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                className="w-full bg-zinc-950 focus:border-famViolate-light  px-4 py-2 font-famFont  "
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                              />
                              <span
                                className="cursor-pointer px-4 py-2"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <i className="bi bi-eye-slash-fill"></i>
                                ) : (
                                  <i className="bi bi-eye-fill"></i>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-[80%] mx-auto mb-4">
                        <div className="w-full flex flex-col justify-center gap-4">
                          <div className="w-full">
                            <label
                              htmlFor="domain"
                              className="uppercase text-sm font-famFont "
                            >
                              Username / Domain
                            </label>
                            <input
                              type="text"
                              disabled={showPasswordField}
                              value={domain}
                              onChange={(e) => handleDomainChange(e)}
                              className="w-full bg-zinc-950 border-1 font-famFont border-gray-600 px-4 py-2 hover:border-famViolate-light"
                              name="domain"
                              placeholder="e.g. JohnDoe"
                            />
                          </div>
                          <div className="w-full">
                            <label
                              htmlFor="password"
                              className="uppercase text-sm font-famFont "
                            >
                              Password
                            </label>
                            <div className="flex mb-4 bg-zinc-950 border-1 border-gray-600 justify-between items-center hover:border-famViolate-light">
                              <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                className="w-full bg-zinc-950  px-4 py-2 font-famFont  "
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                              />
                              <span
                                className="cursor-pointer px-4 py-2"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <i className="bi bi-eye-slash-fill"></i>
                                ) : (
                                  <i className="bi bi-eye-fill"></i>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {error && (
                      <div className=" text-red-600 font-famFont text-small text-center mb-4">
                        {error}
                      </div>
                    )}
                    {alertMessage && (
                      <div className="text-small font-famFont text-center mb-4 text-green-600">
                        {alertMessage}
                      </div>
                    )}
                    {isBridge && (
                      <div className="flex justify-center items-center mb-4">
                        <Button
                          onClick={() => {
                            handleBridge(true);
                          }}
                          className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-xl text-sm text-center mb-2"
                        >
                          Bridge
                        </Button>
                      </div>
                    )}
                    {activeTab === "signUp" && (
                      <div className="font-qanelas text-white capitalize text-xs mb-2 flex justify-center items-center gap-2">
                        Note: You will need 5 USDT and some ETH in Arbitrum
                        Chain to mint a domain.
                      </div>
                    )}
                    <div
                      className={` ${
                        activeTab === "signUp" ? "w-full" : "w-[80%] mx-auto"
                      }  mb-4`}
                    >
                      {activeTab === "signUp" ? (
                        showPasswordField ? (
                          <Button
                            radius="md"
                            className="w-full text-white bg-[#5538CE] "
                            onPress={handleSignUpDomain}
                          >
                            {loader ? (
                              <Spinner color="white" size="sm" />
                            ) : (
                              <span>SignUp</span>
                            )}
                          </Button>
                        ) : (
                          <>
                            {address && (
                              <Button
                                radius="md"
                                className="bg-[#5538CE] text-white w-full mb-2"
                                onPress={handleDomainMinting}
                                // onPress={handlewalletX}
                                // onPress={handleFreeMint}
                              >
                                {loader ? (
                                  <Spinner color="white" size="sm" />
                                ) : (
                                  <span>Mint</span>
                                )}
                              </Button>
                            )}
                            <div
                              className={`w-full flex justify-center items-center ${
                                (!domain ||
                                  !password ||
                                  !logoPreview ||
                                  !referralCode) &&
                                !address &&
                                "disabled-button"
                              } `}
                            >
                              <WalletConnectButton />
                            </div>
                            {/* <div className="w-full flex justify-center item-center">
                              OR
                            </div> */}
                            {/* <div className="flex justify-center items-center">
                              {walletXProvider ? (
                                <Button
                                  className="px-4 py-2 rounded-full border-1 hover:border-gray-400 border-famViolate bg-zinc-950 text-white"
                                  onPress={handleWalletX}
                                >
                                  Connect WalletX for Gasless Mint
                                </Button>
                              ) : (
                                <Link
                                  target="_blank"
                                  href="https://chromewebstore.google.com/detail/walletx-a-gasless-smart-w/mdjjoodeandllhefapdpnffjolechflh"
                                  className="px-4 py-2 rounded-full border-1 hover:border-gray-400 border-famViolate bg-zinc-950 text-white"
                                >
                                  Mint Gasless with WalletX
                                </Link>
                              )}
                            </div> */}
                          </>
                        )
                      ) : (
                        <div className="flex flex-col">
                          <Button
                            radius="md"
                            className="w-full text-white bg-[#5538CE] "
                            onPress={handleLoginDomain}
                          >
                            {loaders.login ? (
                              <Spinner color="white" size="sm" />
                            ) : (
                              <span>Login</span>
                            )}
                          </Button>
                          <div className="text-center py-2">OR</div>
                          {address && (
                            <Button
                              radius="md"
                              className="text-white bg-[#5538CE] mb-2"
                              onPress={handleLoginWithWallet}
                            >
                              {loaders.connectWallet ? (
                                <Spinner color="white" size="sm" />
                              ) : (
                                <span>Login with Wallet</span>
                              )}
                            </Button>
                          )}
                          {
                            <div className="w-full flex justify-center items-center">
                              <WalletConnectButton />
                            </div>
                          }
                        </div>
                      )}
                    </div>

                    <div className="font-qanelas flex justify-center items-center gap-2">
                      <span>
                        {activeTab === "signUp"
                          ? "Already have an account?"
                          : "Don't have an account yet? "}
                      </span>
                      <span
                        onClick={handleActiveTabChanged}
                        className="text-blue-700 text-md cursor-pointer font-bold"
                      >
                        {activeTab === "signUp" ? "LogIn" : "SignUp"}
                      </span>
                    </div>
                  </div>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default LandingPage;
