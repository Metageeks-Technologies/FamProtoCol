"use client";
import React, { useEffect, useState, useCallback } from "react";
import { createCommunity } from "@/redux/reducer/communitySlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getCommunitySuccess } from "@/redux/reducer/adminCommunitySlice";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import Multiselect from "multiselect-react-dropdown";
import { notify } from "@/utils/notify";
import { BallTriangleLoader, TailSpinLoader } from "@/app/components/loader";

interface Category {
  _id: string;
  name: string;
}

interface Ecosystem {
  _id: string;
  name: string;
}

interface CommunityData {
  categories: Category[];
  ecosystems: Ecosystem[];
}

const CreateCommunity: React.FC = () => {
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [ecosystems, setEcosystems] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [isBlockchainRelated, setIsBlockchainRelated] =
    useState<boolean>(false);
  const [isDisable, setIsDisable] = useState<boolean>(true);

  const dispatch = useDispatch<AppDispatch>();
  const communityData = useSelector<RootState, CommunityData>(
    (state: any) => state.adminCommunity
  );
  const UserId = useSelector<RootState, string | undefined>(
    (state) => state?.login.user?._id
  );

  useEffect(() => {
    setIsClient(true);
    dispatch(getCommunitySuccess());
  }, [dispatch]);

  useEffect(() => {
    setIsDisable(
      !(title && description && categories.length > 0 && ecosystems && file)
    );
  }, [title, description, categories, ecosystems, file]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
    const reader: any = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png", ".webp", ".gif", ".svg"],
    },
  });

  const getUploadUrl = async (fileName: string): Promise<string> => {
    try {
      const response = await axios.post<{ url: string }>(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/aws/generate-upload-url`,
        {
          folder: "CommunityLogo",
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
    if (!file) return false;

    try {
      const uploadUrl = await getUploadUrl(file.name);
      if (!uploadUrl) return false;

      const res = await axios.put(uploadUrl, file, {
        headers: { "Content-Type": file.type },
      });

      return res.status === 200;
    } catch (error) {
      console.error("Error uploading file:", error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !categories || !ecosystems || !file)
      return notify("warn", "Please fill all the fields");

    setLoader(true);

    if (!file) {
      setLoader(false);
      return notify("warn", "Please upload a community logo");
    }

    if (
      ![
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "image/svg+xml",
      ].includes(file.type)
    ) {
      setLoader(false);
      return notify(
        "warn",
        "Only JPEG, PNG, WEBP, GIF, SVG images are allowed"
      );
    }

    try {
      const uploadSuccess = await handleUpload();
      if (!uploadSuccess) {
        setLoader(false);
        return notify("error", "Failed to upload image");
      }

      const path = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.amazonaws.com/CommunityLogo/${file.name}`;
      const newCommunity = {
        title,
        description,
        logo: path,
        category: categories.map((cat) => cat.name),
        ecosystem: ecosystems,
        creator: UserId,
      };

      // console.log("newCommunity ",newCommunity)
      const resultAction = await dispatch(createCommunity(newCommunity));
      if (createCommunity.fulfilled.match(resultAction)) {
        // console.log("community",resultAction);
        notify("success", "Community created successfully");
        router.push("/kol/community-project/" + resultAction.payload._id);
      } else {
        notify("error", "Failed to create community");
      }
    } catch (err) {
      console.error("Error creating community:", err);
      notify("error", "An error occurred while creating the community");
    } finally {
      setLoader(false);
    }
  };

  if (!isClient)
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <TailSpinLoader />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#14141494] flex flex-col gap-4 sm:gap-0 items-center justify-center p-8 text-white">
      <div className="bg-[#00000064] border border-gray-800 shadow-xl w-full max-w-2xl p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl mx-4 font-bold font-qanelas text-center mb-2">
          LET'S CREATE YOUR COMMUNITY
        </h1>
        <p className="text-neutral-500 mx-4 font-semibold mb-6 md:mb-8 text-sm md:text-base font-qanelas text-center uppercase">
          Our users like to know more about a community before they get
          involved. Please include any information they may need.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="w-full md:w-1/5 mb-4 md:mb-0">
              <div
                className="bg-black border border-gray-800 h-28 w-28  flex items-center justify-center cursor-pointer mx-auto md:mx-0"
                style={{
                  backgroundImage: `url(${preview})`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              >
                <div {...getRootProps()} className="text-center">
                  <input {...getInputProps()} />
                  <img
                    src="https://clusterprotocol2024.s3.amazonaws.com/others/gallery-add.png"
                    alt="upload image"
                  />
                  {/* <p className="text-xs text-gray-400 mt-2">Upload Logo</p> */}
                </div>
              </div>
              {/* <div className='mt-2 text-center md:text-left'>
                <h2 className="font-bold font-sans text-blue-500 py-1 text-sm">{ file?.name }</h2>
              </div> */}
            </div>

            <div className="w-full md:w-4/5">
              <label className="block font-famFont mb-1 text-sm text-neutral-200">
                DESCRIPTION
              </label>
              <textarea
                placeholder="DESC..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-black border font-famFont border-gray-800  focus:outline-none focus:ring-2 focus:ring-famViolate text-sm"
                rows={3}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            <div className="mb-4 md:mb-0 md:w-1/3">
              <h1 className="font-normal font-famFont mb-1 text-sm text-neutral-200">
                NAME
              </h1>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="px-3 py-2 bg-black border font-famFont border-gray-800 focus:outline-none focus:ring-2 focus:ring-famViolate w-full md:w-28 text-sm"
                required
              />
            </div>

            <div className="flex items-center justify-between md:justify-end md:flex-1">
              <span className="text-sm uppercase mr-2 md:mr-4 font-famFont text-neutral-500">
                Is your project blockchain related?
              </span>
              <div className="flex">
                <button
                  type="button"
                  onClick={() => setIsBlockchainRelated(true)}
                  className="relative w-16 h-10 group "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 68 45"
                    className="w-full h-full"
                  >
                    <path
                      d="M23 22.5L0.5 45H45.5L68 22.5V0H45.5H23V22.5Z"
                      fill={
                        isBlockchainRelated
                          ? "url(#paint0_linear_204_5276)"
                          : "#111111"
                      }
                    />
                    <path
                      d="M23.3536 22.8536L23.5 22.7071V22.5V0.5H45.5H67.5V22.2929L45.2929 44.5H1.70711L23.3536 22.8536Z"
                      stroke="white"
                      strokeOpacity="0.1"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_204_5276"
                        x1="65"
                        y1="-5.04653e-06"
                        x2="26"
                        y2="34.5"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#FA00FF" />
                        <stop offset="1" stopColor="#960099" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="absolute inset-0 font-famFont flex items-center justify-center text-xs">
                    YES
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsBlockchainRelated(false)}
                  className="relative w-16 h-10 group -ml-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 68 45"
                    className="w-full h-full"
                  >
                    <path
                      d="M23 22.5L0.5 45H45.5L68 22.5V0H45.5H23V22.5Z"
                      fill={
                        !isBlockchainRelated
                          ? "url(#paint0_linear_204_5276)"
                          : "#111111"
                      }
                    />
                    <path
                      d="M23.3536 22.8536L23.5 22.7071V22.5V0.5H45.5H67.5V22.2929L45.2929 44.5H1.70711L23.3536 22.8536Z"
                      stroke="white"
                      strokeOpacity="0.1"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_204_5276"
                        x1="65.5"
                        y1="-5.04653e-06"
                        x2="26"
                        y2="34.5"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#FA00FF" />
                        <stop offset="1" stopColor="#960099" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="absolute font-famFont inset-0 flex items-center justify-center text-xs">
                    NO
                  </span>
                </button>
              </div>
            </div>
          </div>

          {isBlockchainRelated && (
            <div className="flex flex-col md:flex-row md:space-x-4 bg-black text-white">
              <div className="md:w-1/2 mb-4 md:mb-0 bg-black text-white">
                <label className="block font-famFont mb-1 text-sm">
                  Categories
                </label>
                <Multiselect
                  options={
                    communityData?.categories?.map((category) => ({
                      name: category?.name,
                      id: category._id,
                    })) || ["No category found"]
                  }
                  selectedValues={categories}
                  onSelect={(selectedList) => {
                    setCategories(selectedList);
                  }}
                  onRemove={(selectedList) => {
                    setCategories(selectedList);
                  }}
                  displayValue="name"
                  placeholder="Select Categories"
                  style={{
                    chips: {
                      background: "#9333ea",
                      color: "white",
                    },
                    searchBox: {
                      border: "0px solid #1f2937",
                      background: "black",
                      color: "white",
                      padding: "5px 14px",
                      fontSize: "14px",
                    },
                    option: {
                      color: "white",
                      background: "black",
                    },
                    optionContainer: {
                      background: "black",
                      height: "200px",
                      overflow: "hidden",
                    },
                    groupHeading: {
                      background: "black",
                      color: "white",
                    },
                  }}
                  className="bg-black border font-famFont border-gray-800 focus:outline-none focus:ring-2 focus:ring-famViolate w-full text-sm"
                  showCheckbox={false}
                  avoidHighlightFirstOption={true}
                  hideSelectedList={false}
                />
              </div>
              <div className="md:w-1/2">
                <label className="block  mb-1 font-famFont text-sm">
                  Ecosystem
                </label>
                <select
                  id="ecosystem"
                  value={ecosystems}
                  onChange={(e) => setEcosystems(e.target.value)}
                  className="px-3 py-2 bg-black border font-famFont text-gray-400 border-gray-800 focus:outline-none focus:ring-2 focus:ring-famViolate w-full text-sm"
                >
                  {communityData?.ecosystems?.map((ecosystem: any) => (
                    <option
                      key={ecosystem._id}
                      value={ecosystem.name}
                      className="bg-zinc-950 hover:bg-famViolate cursor-pointer px-4 py-2 text-white"
                    >
                      {ecosystem.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="flex justify-end mt-6">
            {!loader ? (
              <button
                type="submit"
                className={`px-6 py-2 rounded-lg transition-colors font-famFont duration-300  text-sm bg-famViolate hover:bg-famViolate-dark`}
              >
                Submit
              </button>
            ) : (
              <BallTriangleLoader />
            )}
          </div>
        </form>
      </div>
      <div className="sm:hidden flex justify-center items-center gap-4">
        <div className="border-1 border-[#ffffff59] bg-[#ffffff17] p-2 w-12 h-12 ">
          <img
            src="https://clusterprotocol2024.s3.amazonaws.com/website+logo/logo.png"
            className="w-full h-full object-cover"
            alt="logo"
          />
        </div>
        <div
          className="border-1 border-[#ffffff59] bg-[#ffffff17]  flex justify-center items-center w-12 h-12"
          onClick={()=>router.back()}
        >
          <i className="bi bi-x-lg"></i>
        </div>
      </div>
    </div>
  );
};

export default CreateCommunity;
