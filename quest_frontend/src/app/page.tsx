"use client";
import Link from "next/link";
import { useState, useRef } from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  Input,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { ethers } from "ethers";
import { Spinner } from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { notify } from "@/utils/notify";

const LandingPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [domain, setDomain] = useState<string>("");
  const [error, setError] = useState("");
  const [address, setAddress] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [loader, setLoader] = useState(false);
  const [iswalletconnected, setIswalletconnected] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [hash, setHash] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logo, setLogo] = useState<any>(null);
  const [thankYou, setThankYou] = useState<boolean>(false);
  const router = useRouter();

  const isAlphanumericWithHyphen = (str: string): boolean => {
    // console.log("step1",str);
    const regex = /^[a-zA-Z0-9-]+$/;
    // console.log("step2",regex.test(str));
    return regex.test(str);
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
      // await checkENS(accountAddress);

      console.log("Wallet connected:", accountAddress);
      // onSubmit(taskId, { visited: "wallet connected" });

      return accountAddress;
    } catch (err) {
      console.log("Error connecting wallet:", err);
      return null;
    }
  };

  const handleDomainChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setAlertMessage("");
    setDomain(event.target.value);
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

  const handleCreateDomain = async () => {
    setLoader(true);
    if (!isAlphanumericWithHyphen(domain)) {
      // setError("Invalid user name");
      setLoader(false);
      return;
    }
    const updatedDomain = domain + ".fam";
    console.log(updatedDomain);
    if (!logo )
        {
           setLoader(false);
           setError("Please upload logo");
           return;
        }
        
        if ( ![ 'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml' ].includes( logo.type ) )
        {
            setLoader(false);
            setError( "Only JPEG, PNG, WEBP, GIF, SVG images are allowed" );
            return;
        }
    try {
      const uploadSuccess = await handleUpload();
      console.log(uploadSuccess);
        if ( !uploadSuccess )
        {
            setLoader(false);
            setError("Failed to upload image" );
            return;
        }

      const path = `https://${ process.env.NEXT_PUBLIC_S3_BUCKET_NAME }.s3.amazonaws.com/userProfile/${domain}-${ logo.name }`;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/user/domain`,
        {
          domainAddress: updatedDomain,
          image: path,
          password: password,
          hashCode: hash,
          walletAddress: address,
        }
      );

      if (response.status === 200) {
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

  const handleMinting = async () => {
    setLoader(true);

    if (!isAlphanumericWithHyphen(domain)) {
      setError(
        "Invalid Username: The username must contain only alphanumeric characters and hyphens. Spaces are not allowed"
      );
      setLoader(false);
      return;
    }

    const updatedDomain = domain + ".fam";

    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    const contractABI = process.env.NEXT_PUBLIC_CONTRACT_ABI
      ? JSON.parse(process.env.NEXT_PUBLIC_CONTRACT_ABI)
      : null;

    // console.log("step1 ", contractAddress, contractABI, address);
    if (!contractAddress || !contractABI || !address) {
      const res = await connectWallet();
      if(res){
        setAlertMessage("Wallet connected successfully");
        setIswalletconnected(true);
      }
      setLoader(false);
      return;
    }
    console.log("step2: react minting stage ");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      // Sending transaction
      const tx = await contract.mintDomain(updatedDomain);

      // Waiting for the transaction to be mined
      await tx.wait();

      // Update the state to show success message
      console.log("Domain mited successfully", tx);
      setAlertMessage(`Domain ${updatedDomain} minted successfully!`);
      setHash(tx.hash);
      setShowPasswordField(true);
    } catch (error) {
      // Type narrowing with `if` checks
      if (typeof error === "object" && error !== null && "reason" in error) {
        setError(`${(error as { reason: string }).reason}`);
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        setError(`${(error as { message: string }).message}`);
      } else {
        setError("An unknown error occurred.");
      }
    }
    setLoader(false);
  };
  const getUploadUrl = async (fileName: string): Promise<string> => {
    try {
      const response = await axios.post<{ url: string }>(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/aws/generate-upload-url`,
        {
          folder: `userProfile`,
          fileName,
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
    console.log(logo);
    
    try {
      const logoName=logo.name as string;
      const fileName=domain+"-"+logoName;

      const uploadUrl = await getUploadUrl(fileName);
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

  const handleLogoClick = () => {
    fileInputRef.current?.click();
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

  return (
    <>
        <div className="min-h-screen landing-page">
          <div className="w-[90%] mx-auto p-8">
          <div className="flex flex-col justify-between h-screen">
            <div className="w-full md:mt-0 mt-4">
              <div className="flex md:flex-row flex-col-reverse md:justify-between items-center gap-3 ">
                <div className="flex items-center gap-1">
                  <div>
                    <h1 className="text-[#FA00FF]">VIEW DOCUMENTATION</h1>
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

                <div className="flex items-center gap-6">
                  <div className="flex items-center">
                    <h1 className="text-zinc-400 ">SOCIAL MEDIA:</h1>
                  </div>
                  <div className="flex row gap-1">
                    <div className="box1 right-trapezium w-[2rem] h-[2rem] bg-[#ffffff33]">
                      <svg
                        className="box2 right-trapezium p-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="17"
                        height="17"
                        viewBox="0 0 17 17"
                        fill="none"
                      >
                        <path
                          d="M12.5736 2.125H14.7461L10.0003 7.52604L15.5834 14.875H11.2115L7.78815 10.4175L3.87035 14.875H1.69577L6.7724 9.09854L1.41669 2.125H5.89902L8.99444 6.19933L12.5736 2.125ZM11.8115 13.5802H13.0156L5.24452 3.35183H3.95252L11.8115 13.5802Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                    <div className="box1 left-right-trapezium w-[2rem] h-[2rem] px-2 bg-[#ffffff33]">
                      <svg
                        className="box2 left-right-trapezium p-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="17"
                        height="17"
                        viewBox="0 0 17 17"
                        fill="none"
                      >
                        <path
                          d="M13.6496 3.77537C12.7075 3.3362 11.6875 3.01745 10.625 2.83328C10.6157 2.83299 10.6064 2.83473 10.5978 2.83841C10.5893 2.84208 10.5816 2.84758 10.5754 2.85453C10.4479 3.08828 10.2991 3.39287 10.2 3.62662C9.07302 3.45662 7.92694 3.45662 6.79998 3.62662C6.70081 3.38578 6.55206 3.08828 6.41748 2.85453C6.4104 2.84037 6.38915 2.83328 6.3679 2.83328C5.3054 3.01745 4.29248 3.3362 3.34331 3.77537C3.33623 3.77537 3.32915 3.78245 3.32206 3.78953C1.3954 6.67245 0.864148 9.47745 1.12623 12.2541C1.12623 12.2683 1.13331 12.2825 1.14748 12.2895C2.42248 13.2245 3.6479 13.7912 4.85915 14.1666C4.8804 14.1737 4.90165 14.1666 4.90873 14.1525C5.19206 13.7629 5.44706 13.352 5.66665 12.92C5.68081 12.8916 5.66665 12.8633 5.63831 12.8562C5.23456 12.7004 4.85206 12.5162 4.47665 12.3037C4.44831 12.2895 4.44831 12.247 4.46956 12.2258C4.54748 12.1691 4.6254 12.1054 4.70331 12.0487C4.71748 12.0345 4.73873 12.0345 4.7529 12.0416C7.18956 13.1537 9.81748 13.1537 12.2258 12.0416C12.24 12.0345 12.2612 12.0345 12.2754 12.0487C12.3533 12.1125 12.4312 12.1691 12.5091 12.2329C12.5375 12.2541 12.5375 12.2966 12.5021 12.3108C12.1337 12.5304 11.7441 12.7075 11.3404 12.8633C11.3121 12.8704 11.305 12.9058 11.3121 12.927C11.5387 13.3591 11.7937 13.77 12.07 14.1595C12.0912 14.1666 12.1125 14.1737 12.1337 14.1666C13.3521 13.7912 14.5775 13.2245 15.8525 12.2895C15.8666 12.2825 15.8737 12.2683 15.8737 12.2541C16.1854 9.04537 15.3566 6.26162 13.6779 3.78953C13.6708 3.78245 13.6637 3.77537 13.6496 3.77537ZM6.03498 10.5612C5.3054 10.5612 4.69623 9.88828 4.69623 9.05953C4.69623 8.23078 5.29123 7.55787 6.03498 7.55787C6.78581 7.55787 7.38081 8.23787 7.37373 9.05953C7.37373 9.88828 6.77873 10.5612 6.03498 10.5612ZM10.9721 10.5612C10.2425 10.5612 9.63332 9.88828 9.63332 9.05953C9.63332 8.23078 10.2283 7.55787 10.9721 7.55787C11.7229 7.55787 12.3179 8.23787 12.3108 9.05953C12.3108 9.88828 11.7229 10.5612 10.9721 10.5612Z"
                          fill="#8C71FF"
                        />
                      </svg>
                    </div>
                    <div className="box1 left-trapezium w-[2rem] h-[2rem] bg-[#ffffff33]">
                      <svg
                        className="box2 left-trapezium p-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                      >
                        <g clipPath="url(#clip0_213_2492)">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M5.40967 0.295777C3.95975 0.717526 2.67072 1.56676 1.71099 2.73255C0.751252 3.89834 0.165424 5.32648 0.0300293 6.83042H3.4586C3.65736 4.54191 4.32089 2.31799 5.4086 0.294706L5.40967 0.295777ZM3.4586 8.16971H0.0300293C0.165141 9.6737 0.750718 11.102 1.71027 12.268C2.66981 13.4339 3.95872 14.2834 5.4086 14.7054C4.32089 12.6821 3.65736 10.4582 3.4586 8.16971ZM7.12717 14.9915C5.82731 12.9316 5.03081 10.5946 4.80217 8.16971H10.1968C9.96817 10.5946 9.17167 12.9316 7.87182 14.9915C7.62375 15.0035 7.37524 15.0035 7.12717 14.9915ZM9.59146 14.7043C11.0412 14.2824 12.33 13.4331 13.2895 12.2673C14.249 11.1016 14.8347 9.67351 14.97 8.16971H11.5415C11.3427 10.4582 10.6792 12.6821 9.59146 14.7054V14.7043ZM11.5415 6.83042H14.97C14.8349 5.32643 14.2493 3.89815 13.2898 2.73216C12.3302 1.56618 11.0413 0.716705 9.59146 0.294706C10.6792 2.31798 11.3427 4.5419 11.5415 6.83042ZM7.12717 0.00863426C7.37559 -0.00352913 7.62446 -0.00352913 7.87289 0.00863426C9.17237 2.06857 9.9685 4.40557 10.1968 6.83042H4.80324C5.03574 4.39078 5.83396 2.05185 7.12717 0.00863426Z"
                            fill="#FA00FF"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_213_2492">
                            <rect width="15" height="15" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-auto mb-auto">
               <div className="flex items-center justify-center h-full text-white">
             {thankYou ? (
                <div className="flex flex-col justify-center text-white items-center ">
                 <div className="text-center mb-4 font-bold text-lg">Thank you for registering your domain with us! </div>
                 <div className="text-center mb-4 ">We're excited to have you on board and look forward to supporting you as you build and grow your online presence. </div>
        </div>
             ):(
               <div className="z-10 text-center max-w-3xl">
                <p className="text-sm tracking-widest text-neutral-400">
                  FAM PROTOCOL PRESENTS...
                </p>
                <h1 className="mt-4 text-2xl font-bold sm:text-5xl lg:text-4xl">
                  EMBRACE THE ALMIGHTY REWARDS OF BLOCKCHAIN NETWORK!
                </h1>
                <p className="mt-6 text-neutral-300 leading-relaxed ">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                  <Button
                    // onClick={() => handleOpen()}
                    className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
                  >
                    Get Onboarded
                  </Button>
                  <Link
                    // href="/home"
                    href='#'
                    className="bg-white text-black py-2 px-6 rounded-lg hover:bg-gray-200 transition duration-300"
                  >
                    Explore
                  </Link>
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
                  <div className="text-2xl font-bold font-['Qanelas'] uppercase mb-6 md:mb-4 ">
                    Get onboarded
                  </div>
                  <div className="flex gap-4 mb-4 md:flex-row flex-col justify-between items-center rounded-lg">
                    <div className="w-full md:w-1/3 flex justify-center items-center">
                      <div
                        className="bg-gray-950 border border-gray-600 h-36 w-36 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-300 hover:border-blue-500"
                        onClick={handleLogoClick}
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
                      <div className="flex gap-4 flex-row justify-between items-center">
                        <div>
                          <label
                            htmlFor="domain"
                            className="uppercase font-['profontwindows']"
                          >
                            Setup Username
                          </label>
                          <input
                            type="text"
                            disabled={showPasswordField}
                            value={domain}
                            onChange={(e)=>handleDomainChange(e)}
                            className="w-full bg-black border-1 border-gray-500 px-4 py-2 "
                            name="domain"
                            placeholder="domain"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="inviteCode"
                            className="uppercase font-['profontwindows']"
                          >
                            Invite Code
                          </label>
                          <input
                            disabled={true}
                            type="text"
                            className="w-full bg-black border-1 text-gray-500 border-gray-500 px-4 py-2 "
                            name="inviteCode"
                            placeholder="invite code"
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="password"
                          className="uppercase font-['profontwindows']"
                        >
                          Password
                        </label>
                        <div className="flex mb-4 bg-black border-1 border-gray-500 justify-between text-gray-500 items-center ">
                          <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            className="w-full bg-black  px-4 py-2 "
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
                  {error && (
                    <div className=" text-red-600 font-['profontwindows'] text-small text-start mb-4">
                      {error}
                    </div>
                  )}
                  {alertMessage && (
                    <div className="text-small font-['profontwindows'] text-start mb-4 text-green-600">
                      {alertMessage}
                    </div>
                  )}

                  {/* <button className="mb-4 bg-red-800 text-white " onClick={handleCreateDomain}>upload</button> */}
                  <div className="w-full">
                    {showPasswordField ? (
                      <Button
                        radius="md"
                        className="w-full text-white bg-[#5538CE] "
                        onPress={handleCreateDomain}
                      >
                      {loader ? <Spinner color="white" size="sm" /> :  <span>SignUp</span>} 
                      </Button>
                    ) : (
                      <Button
                        radius="md"
                        className="bg-[#5538CE] text-white w-full"
                        onPress={handleMinting}
                      >
                        {loader ? (
                          <Spinner color="white" size="sm" />
                        ) : iswalletconnected ? (
                          <span>Mint</span>
                        ) : (
                          <span>Connect Wallet</span>
                        )}
                      </Button>
                    )}
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
