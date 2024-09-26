"use client";
import { useState, useRef, useEffect } from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,Spinner
} from "@nextui-org/react";
import { ethers } from "ethers";
import axios from "axios";
import { notify } from "@/utils/notify";
import { connectWallet } from "@/utils/wallet-connect";
import Swal from "sweetalert2";
import upgradeableContractAbi from "@/utils/abi/upgradableContract.json";
import usdc from "@/utils/abi/usdc.json";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LandingPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [domain, setDomain] = useState<string>("");
  const [existingDomain, setExistingDomain] = useState<string[]>([]);
  const [isDomainAvailable, setIsDomainAvailable] = useState<string>("");
  const [referralCode, setReferralCode] = useState("");
  const [error, setError] = useState("");
  const [address, setAddress] = useState<string>("");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [loader, setLoader] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [hash, setHash] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logo, setLogo] = useState<any>(null);
  const [thankYou, setThankYou] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("login");
  const [loaders, setLoaders] = useState({
    connectWallet: false,
    login: false,
  });
  const router = useRouter();

  const fetchDomains = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/user/domains`
      );
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

  const isAlphanumericWithHyphen = (str: string): boolean => {
    const regex = /^[a-zA-Z0-9-]+$/;
    return regex.test(str);
  };

  const handleDomainChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setAlertMessage("");
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
    setError("");
    onOpen();
    setShowPasswordField(false);
    setPassword("");
    setAlertMessage("");
    setThankYou(false);
    // setIswalletconnected(false)
  };

  const handleClose = () => {
    setError("");
    setAlertMessage("");
    onClose();
  };

  const handleSignUpDomain = async () => {
    setLoader(true);
    setError("");
    setAlertMessage("");
    if (!isAlphanumericWithHyphen(domain)) {
      setError("Invalid username");
      setLoader(false);
      return;
    }
    const updatedDomain = domain + ".fam";
    // console.log(updatedDomain);
    if (!logo) {
      setLoader(false);
      setError("Please upload logo");
      return;
    }
    if (!["image/jpeg", "image/png", "image/jpg"].includes(logo.type)) {
      setLoader(false);
      setError("Only JPEG, PNG,JPG images are allowed");
      return;
    }
    try {
      const uploadSuccess = await handleUpload();
      // console.log(uploadSuccess);
      if (!uploadSuccess) {
        setLoader(false);
        setError("Failed to upload image");
        return;
      }

      const path = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.amazonaws.com/userProfile/${domain}`;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/user/signUpDomain`,
        {
          domainAddress: updatedDomain,
          image: path,
          password: password,
          hashCode: hash,
          walletAddress: address,
          referralCode,
        },
        { withCredentials: true }
      );

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
      setError(err.response.data.message);
      setLoader(false);
    }
  };
  const handleLoginDomain = async () => {
    setLoaders({ ...loaders, login: true });
    setError("");
    setAlertMessage("");
    if (!isAlphanumericWithHyphen(domain)) {
      setError("Invalid username");
      setLoaders({ ...loaders, login: false });
      return;
    }
    const updatedDomain = domain + ".fam";

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/user/loginDomain`,
        {
          domainAddress: updatedDomain,
          password,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        notify("success", response.data.message);
        handleClose();
        router.push("/user/referral/dashboard");
      }
    } catch (err: any) {
      console.log(err);
      setError(err.response.data.message);
    }
    setLoaders({ ...loaders, login: false });
  };

  const handleLoginWithWallet = async () => {
    try {
      setLoaders({ ...loaders, connectWallet: true });
      setError("");
      setAlertMessage("");
      const walletInfo = await connectWallet();
      console.log("wallet", walletInfo);
      if (walletInfo) {
        setAlertMessage("Wallet connected successfully");
        setIsWalletConnected(true);

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/user/loginDomain`,
          {
            walletAddress: walletInfo.address,
          },
          { withCredentials: true }
        );

        console.log("response", response.data);

        if (response.data.success) {
          // alert(response.data.message);
          notify("success", response.data.message);
          handleClose();
          // setShowPasswordField(true);
          router.push("/user/referral/dashboard");
        }
      } else {
        setError("Failed to connect wallet.");
      }
    } catch (error: any) {
      console.log(error);
      setError(error.response.data.message);
    }
    setLoaders({ ...loaders, connectWallet: false });
  };

  const handleDomainMinting = async () => {
    setLoader(true);
    setError("");
    setAlertMessage("");
  
    // Validate domain name
    if (!domain || domain.length < 3) {
      setError("Domain name must be at least 4 characters long");
      setLoader(false);
      return;
    }
  
    if (isDomainAvailable === "false") {
      setError("Domain already exists");
      setLoader(false);
      return;
    }
  
    if (!isAlphanumericWithHyphen(domain)) {
      setError(
        "Invalid Domain: The domain must contain only alphanumeric characters and hyphens. Spaces are not allowed"
      );
      setLoader(false);
      return;
    }
  
    const updatedDomain = domain + ".fam";
  
    const ArbicontractAddress = process.env.NEXT_PUBLIC_UPGRADABLECONTRACT_ADDRESS!;
    const usdcContractAddress = process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS!;
    const contractABI = upgradeableContractAbi;
    const usdcABI = usdc;
  
    if (!ArbicontractAddress || !contractABI || !address) {
      const walletInfo = await connectWallet();
      if (walletInfo) {
        setAlertMessage("Wallet connected successfully");
        setIsWalletConnected(true);
        setAddress(walletInfo.address);
      } else {
        setError("Failed to connect wallet.");
        setLoader(false);
        return;
      }
    }
  
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
  
      // Initialize the contract instance
      const contract = new ethers.Contract(ArbicontractAddress, contractABI, signer);
  
      // Check if the user is whitelisted for free mint
      const isFreeMintWhitelisted = await contract.freeMintWhitelist(await signer.getAddress());
  
      if (isFreeMintWhitelisted) {
        // Call free mint function
        const tx = await contract.freeMintDomain(updatedDomain, referralCode);
        await tx.wait();
        setAlertMessage(`Domain ${updatedDomain} minted for free successfully`);
        setHash(tx.hash);
        setShowPasswordField(true);
      } else {
        // Check if the user is whitelisted for discount mint
        const isDiscountMintWhitelisted = await contract.discountMintWhitelist(await signer.getAddress());
  
        if (isDiscountMintWhitelisted) {
          // Discounted mint fee (2.5 USDC)
          const usdcAmountDiscount = ethers.parseUnits("2.5", 6); // 2.5 USDC with 6 decimals
  
          // Initialize USDC contract instance
          const usdcContract = new ethers.Contract(usdcContractAddress, usdcABI, signer);
  
          // Check the user's USDC balance
          const usdcBalance = await usdcContract.balanceOf(await signer.getAddress());
          if (usdcBalance < usdcAmountDiscount) {
            setError("Insufficient USDC balance. Please ensure you have at least 2.5 USDC.");
            setLoader(false);
            return;
          }
  
          // Approve the discounted minting fee (2.5 USDC) for your contract
          const approveTxDiscount = await usdcContract.approve(ArbicontractAddress, usdcAmountDiscount);
          await approveTxDiscount.wait();
  
          // Call discount mint function
          const tx = await contract.discountMintDomain(updatedDomain, referralCode);
          await tx.wait();
          setAlertMessage(`Domain ${updatedDomain} minted with discount successfully`);
          setHash(tx.hash);
          setShowPasswordField(true);
        } else {
          // If not whitelisted, check referral code validity and call mintDomainWithReferral
          if (!referralCode || referralCode === "") {
            setError("You must provide a valid referral code to mint.");
            setLoader(false);
            return;
          }
  
          // Initialize USDC contract instance
          const usdcContract = new ethers.Contract(usdcContractAddress, usdcABI, signer);
  
          // Check the user's USDC balance
          const usdcBalance = await usdcContract.balanceOf(await signer.getAddress());
          const usdcAmount = ethers.parseUnits("5", 6); // 5 USDC with 6 decimals
  
          if (usdcBalance < usdcAmount) {
            setError("Insufficient USDC balance. Please ensure you have at least 5 USDC.");
            setLoader(false);
            return;
          }
  
          // Approve the minting fee (5 USDC) for your contract
          const approveTx = await usdcContract.approve(ArbicontractAddress, usdcAmount);
          await approveTx.wait();
  
          // Call mintDomainWithReferral function
          const tx = await contract.mintDomainWithReferral(updatedDomain, referralCode);
          await tx.wait();
  
          setAlertMessage(`Domain ${updatedDomain} minted successfully with referral`);
          setHash(tx.hash);
          setShowPasswordField(true);
        }
      }
    } catch (error) {
      if (typeof error === "object" && error !== null && "reason" in error) {
        setAlertMessage("");
        setError(`${(error as { reason: string }).reason}`);
      } else if (typeof error === "object" && error !== null && "message" in error) {
        setError(`${(error as { message: string }).message}`);
        setAlertMessage("");
      } else {
        setError("An unknown error occurred.");
        setAlertMessage("");
      }
    }
  
    setLoader(false);
  };
  
  const getUploadUrl = async (): Promise<string> => {
    try {
      const response = await axios.post<{ url: string }>(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/aws/generate-upload-url`,
        {
          folder: "userProfile",
          fileName: domain,
        }
      );
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
    setError("");
    setAlertMessage("");
  };

  return (
    <>
      <div className="landing-page">
        <div className="">
          <div className="w-[90%] mx-auto p-8">
            <div className="flex flex-col justify-between h-screen">
              <div className="w-full md:mt-0 mt-4">
                <div className="flex md:flex-row flex-col-reverse md:justify-between items-center gap-3 ">
                  <div className="flex items-center gap-1">
                    <div
                      onClick={() => comingSoon()}
                      className="text-[#FA00FF] cursor-pointer font-famFont "
                    >
                      VIEW DOCUMENTATION
                    </div>
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
              </div>
              <div className="mt-auto mb-auto">
                <div className="flex items-center justify-center h-full text-white">
                  {thankYou ? (
                    <div className="flex flex-col justify-center text-white items-center ">
                      <div className="text-center mb-4 font-bold text-lg">
                        Thank you for registering your domain with us!{" "}
                      </div>
                      <div className="text-center mb-4 ">
                        We're excited to have you on board and look forward to
                        supporting you as you build and grow your online
                        presence.{" "}
                      </div>
                      <div className="flex justify-center items-center">
                        <Link
                          href="/user/referral/dashboard"
                          className="px-4 py-2 bg-famViolate rounded-lg "
                        >
                          Visit Profile
                        </Link>
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
                          onClick={() => comingSoon()}
                          // onClick={() => handleOpen()}
                          className="bg-[#5538CE] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#6243dd] transition duration-300"
                        >
                          Get Onboarded
                        </Button>
                        <Button
                          onClick={() => comingSoon()}
                          // onClick={()=>router.push('/home')}
                          className="bg-white text-black font-semibold py-2 px-6 rounded-lg hover:bg-gray-200 transition duration-300"
                        >
                          Explore
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        backdrop="blur"
        placement="center"
        shadow="sm"
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
                <div className="flex flex-col justify-center items-center  ">
                  <div className="text-2xl font-bold font-qanelas uppercase mb-6 md:mb-4 ">
                    Get Onboarded
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
                              Setup Username
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
                              onChange={(e) => setReferralCode(e.target.value)}
                              className="w-full bg-zinc-950 border-1 text-gray-500 border-gray-600 font-famFont  px-4 py-2 hover:border-famViolate-light"
                              name="inviteCode"
                              placeholder="invite code"
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
                          <div className="flex mb-4 bg-zinc-950 border-1 border-gray-600 justify-between text-gray-500 items-center hover:border-famViolate-light">
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
                            Username
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
                          <div className="flex mb-4 bg-zinc-950 border-1 border-gray-600 justify-between text-gray-500 items-center hover:border-famViolate-light">
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
                    <div className=" text-red-600 font-famFont  text-small text-start mb-4">
                      {error}
                    </div>
                  )}
                  {alertMessage && (
                    <div className="text-small font-famFont  text-start mb-4 text-green-600">
                      {alertMessage}
                    </div>
                  )}

                  {activeTab === "signUp" && (
                    <div className="font-qanelas text-white capitalize text-xs mb-2 flex justify-center items-center gap-2">
                      phase 1 domain minting price starts from 5 usdc
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
                        <Button
                          radius="md"
                          className="bg-[#5538CE] text-white w-full"
                          onPress={handleDomainMinting}
                        >
                          {loader ? (
                            <Spinner color="white" size="sm" />
                          ) : isWalletConnected ? (
                            <span>Mint</span>
                          ) : (
                            <span>Connect Wallet</span>
                          )}
                        </Button>
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
                            <span>LogIn</span>
                          )}
                        </Button>
                        <div className="text-center py-2">OR</div>
                        <Button
                          radius="md"
                          className="text-white bg-[#5538CE] "
                          onPress={handleLoginWithWallet}
                        >
                          {loaders.connectWallet ? (
                            <Spinner color="white" size="sm" />
                          ) : (
                            <span>Connect Wallet</span>
                          )}
                        </Button>
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
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default LandingPage;
