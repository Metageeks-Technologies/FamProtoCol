import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchUserData, updateUserProfile } from "@/redux/reducer/authSlice";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Chip } from "@nextui-org/react";
import { notify } from "@/utils/notify";

const ModalForm = () =>
{
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [ isModalVisible, setIsModalVisible ] = useState( false );
  const [ loader, setLoader ] = useState( false );
  const fileInputRef = useRef<HTMLInputElement>( null );

  const user = useSelector( ( state: RootState ) => state.login.user );
  const [ formData, setFormData ] = useState( {
    bgImage: user?.bgImage || "",
    bio: user?.bio || "",
    nickname: user?.nickname || "",
    image: user?.image || "",
  } );
  const [ file, setFile ] = useState<File | null>( null );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) =>
  {
    const { name, value } = e.target;
    setFormData( { ...formData, [ name ]: value } );
  };

  const handleFileChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
  {
    if ( e.target.files && e.target.files[ 0 ] )
    {
      setFile( e.target.files[ 0 ] );
    }
  };

  const getUploadUrl = async ( fileName: string ) =>
  {
    try
    {
      const response = await axios.post( `${ process.env.NEXT_PUBLIC_SERVER_URL }/aws/generate-upload-url`, {
        folder: 'userProfile',
        fileName,
      } );
      return response.data.url;
    } catch ( error )
    {
      console.error( 'Error getting upload URL:', error );
      throw error;
    }
  };

  const handleUpload = async () =>
  {
    if ( !file ) return false;

    try
    {
      const uploadUrl = await getUploadUrl( file.name );
      if ( !uploadUrl ) return false;

      const res = await axios.put( uploadUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
      } );

      if ( res.status === 200 )
      {
        // console.log( 'File uploaded successfully', res );
        return true;
      } else
      {
        // console.log( 'File upload failed', res );
        return false;
      }
    } catch ( error )
    {
      console.log( 'Error uploading file:', error );
      return false;
    }
  };

  const handleSubmit = async ( e: React.FormEvent ) =>
  {
    e.preventDefault();
    setLoader( true );

    try
    {
      let newImageUrl = formData.image;
      if ( file )
      {
        const uploadSuccess = await handleUpload();
        if ( uploadSuccess )
        {
          newImageUrl = `https://${ process.env.NEXT_PUBLIC_S3_BUCKET_NAME }.s3.amazonaws.com/userProfile/${ file.name }`;
        } else
        {
          setLoader( false );

          return;
        }
      }

      const updatedFormData = { ...formData, image: newImageUrl };
      // console.log( updatedFormData );

      const resultAction = await dispatch( updateUserProfile( updatedFormData ) );
      if ( updateUserProfile.fulfilled.match( resultAction ) )
      {
        dispatch( fetchUserData() );
        notify("success", "Profile updated successfully");

        setIsModalVisible( false );
       
      } else
      {
        notify("error", "Failed to update profile");
      }
      
    } catch ( err )
    {
      console.log( "err", err );
      // You might want to add an error notification here
    } finally
    {
      setLoader( false );
    }
  };

  const toggleModal = () =>
  {
    setIsModalVisible( !isModalVisible );
  };

  return (
    <div >
      <div className="flex justify-start items-center cursor-pointer ">
        <Chip onClick={ toggleModal } variant="solid" className="text-white bg-[#d200e7]" color="secondary">
          Edit profile
        </Chip>
      </div>
      { isModalVisible && (
        <div
          id="static-modal"
          tabIndex={ -1 }
          aria-hidden="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center"
        >
          <div className="relative p-4 w-full max-w-md">
            <div className=" bg-[#121212] rounded-lg shadow-xl">
              <button
                type="button"
                onClick={ toggleModal }
                className="absolute top-3 right-3 text-gray-400 bg-transparent hover:bg-gray-700 hover:text-white rounded-lg text-sm p-1.5 inline-flex items-center"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </button>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Edit Profile</h3>
                <form onSubmit={ handleSubmit } className="space-y-4">
                  <div className="flex flex-col items-center mb-4">
                    <div
                      className="bg-gray-700 border-2 border-gray-600 h-28 w-28 rounded-full flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-300 hover:border-blue-500 relative group mb-2"
                      onClick={ () => fileInputRef.current?.click() }
                    >
                      { formData.image || file ? (
                        <>
                          <img
                            src={ file ? URL.createObjectURL( file ) : formData.image }
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <FaEdit className="text-white text-2xl" />
                          </div>
                        </>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 } d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      ) }
                    </div>
                    <label htmlFor="image" className="text-sm font-medium text-gray-300 cursor-pointer">
                      Change Profile Picture
                    </label>
                    <input
                      type="file"
                      id="image"
                      name="image"
                      onChange={ handleFileChange }
                      ref={ fileInputRef }
                      className="hidden"
                      accept="image/*"
                    />
                  </div>

                  <div>
                    <label htmlFor="nickname" className="block text-sm font-medium text-gray-300 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="nickname"
                      value={ formData.nickname }
                      onChange={ handleChange }
                      className="w-full px-3 py-2 bg-[#121212] border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your Name"
                    />
                  </div>

                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={ formData.bio }
                      onChange={ handleChange }
                      rows={ 4 }
                      className="w-full px-3 py-2 bg-[#121212] border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell us about yourself"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                  >
                    Update Profile
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) }
    </div>
  );
};

export default ModalForm;
