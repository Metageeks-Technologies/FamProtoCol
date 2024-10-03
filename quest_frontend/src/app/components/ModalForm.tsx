import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchUserData, updateUserProfile } from "@/redux/reducer/authSlice";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/navigation";
import { notify } from "@/utils/notify";
import { TailSpin } from "react-loader-spinner";
import { Button } from "@nextui-org/react";

const ModalForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loader, setLoader] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const user = useSelector((state: RootState) => state.login.user);
  const [formData, setFormData] = useState({
    bio: user?.bio || "",
    displayName: user?.displayName || "",
    image: user?.image || "",
  });
  

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const getUploadUrl = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/aws/generate-upload-url`,
        {
          folder: "userProfile",
          fileName: user?.domain.domainAddress,
        }
      );
      return response.data.url;
    } catch (error) {
      console.error("Error getting upload URL:", error);
      throw error;
    }
  };

  const handleUpload = async () => {
    if (!file) return false;

    try {
      const uploadUrl = await getUploadUrl();
      if (!uploadUrl) return false;

      const res = await axios.put(uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      if (res.status === 200) {
        // console.log( 'File uploaded successfully', res );
        return true;
      } else {
        // console.log( 'File upload failed', res );
        return false;
      }
    } catch (error) {
      console.log("Error uploading file:", error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoader(true);

    try {
      let newImageUrl = formData.image;
      if (file) {
        const uploadSuccess = await handleUpload();
        if (uploadSuccess) {
          newImageUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.amazonaws.com/userProfile/${user?.domain.domainAddress}`;
        } else {
          setLoader(false);
          return;
        }
      }

      const updatedFormData = { ...formData, image: newImageUrl };
      // console.log( updatedFormData );

      const resultAction = await dispatch(updateUserProfile(updatedFormData));
      if (updateUserProfile.fulfilled.match(resultAction)) {
        dispatch(fetchUserData());
        notify("success", "Profile updated successfully");
        setIsModalVisible(false);
        
      } else {
        notify("error", "Failed to update profile");
      }
    } catch (err) {
      console.log("err", err);
      // You might want to add an error notification here
    } finally {
      setLoader(false);
    }
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
    setLoader(false);
    setFile(null);
    setFormData({
      bio: user?.bio || "",
      displayName: user?.displayName || "",
      image: user?.image || "",
    })
  };

  return (
    <>
      <Button
        onPress={toggleModal}
        variant="bordered"
        className="w-full font-qanelas border-2 border-gray-600  text-white cursor-pointer px-4 py-2 rounded-md"
      >
        Edit profile
      </Button>
      {isModalVisible && (
        <div
          id="static-modal"
          tabIndex={-1}
          inert
          className="fixed inset-0 z-50 overflow-y-auto  bg-black bg-opacity-50 flex items-center justify-center"
        >
          <div className="relative p-4 w-full max-w-md">
            <div className=" bg-[#121212] border-1 border-gray-800 shadow-xl">
              <button
                type="button"
                onClick={toggleModal}
                className="absolute top-4 right-4 text-gray-400 bg-transparent hover:text-white rounded-full text-sm p-1.5 inline-flex items-center"
              >
              <i className="bi bi-x-lg"></i>
              </button>
              <div className="p-6">
              <div className="flex justify-center items-center" >
                <h3 className="text-xl font-semibold font-qanelas text-white mb-4">
                  Edit Profile
                </h3>
              </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col items-center mb-4">
                    <div
                      className="bg-gray-700 border-2 border-gray-600 h-28 w-28 rounded-full flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-300 hover:border-famViolate relative group mb-2"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {formData.image || file ? (
                        <>
                          <img
                            src={
                              file ? URL.createObjectURL(file) : formData.image
                            }
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <FaEdit className="text-white text-2xl" />
                          </div>
                        </>
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
                    <label
                      htmlFor="image"
                      className="text-sm font-medium font-famFont text-gray-300 cursor-pointer"
                    >
                      Change Profile Picture
                    </label>
                    <input
                      type="file"
                      id="image"
                      name="image"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="displayName"
                      className="block text-sm font-medium font-famFont text-gray-300 mb-1"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-[#121212] border font-famFont border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-famViolate focus:border-transparent"
                      placeholder="Your Name"
                    />
                  </div>
                  {/* <div>
                    <label
                      htmlFor="bio"
                      className="block text-sm font-medium font-famFont text-gray-300 mb-1"
                    >
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-3 py-2 bg-[#121212] border font-famFont border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-famViolate focus:border-transparent"
                      placeholder="Tell us about yourself"
                    />
                  </div> */}
                  <button
                    type="submit"
                    disabled={loader}
                    className="w-full py-2 px-4 border font-famFont border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-famViolate hover:bg-famViolate-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-famViolate transition duration-150 ease-in-out"
                  >
                  {
                    loader ? <span className="flex justify-center items-center" ><TailSpin width={20} height={20} /></span> :"Update Profile"
                  }
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalForm;
