"use client";
import { notify } from "@/utils/notify";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { BallTriangle } from "react-loader-spinner";

interface Grant {
  _id: string;
  title: string;
  description: string;
  logoUrl: string;
  organizer: string;
  prize: string;
}

const Grantspage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    organizer: "",
    prize: "",
    id: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [grantItems, setGrantItems] = useState<Grant[] | any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editFlag, setEditFlag] = useState<boolean>(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const initailFormData = () => {
    setFormData({
      title: "",
      description: "",
      organizer: "",
      prize: "",
      id: "",
    });
    setFile(null);
  };

  const handleOpen = (option: string, grant: Grant | null) => {
    initailFormData();
    setLoading(false);
    if (option === "edit" && grant) {
      setFormData({
        title: grant.title,
        description: grant.description,
        organizer: grant.organizer,
        prize: grant.prize,
        id:grant._id,
      });
    }
    setEditFlag(option === "edit" ? true : false);
    onOpen();
  };
  const handleModalClose = () => {
    initailFormData();
    setLoading(false);
    onClose();
  };

  const getGrants = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/grant`
      );
      setGrantItems(response.data.grants);
      setLoading(false);
    } catch (error) {
      console.log("error in getting grants :-", error);
    }
  };

  useEffect(() => {
    getGrants();
  }, []);

  //dropzone for file uploading
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const getUploadUrl = async (fileName: string) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/aws/generate-upload-url`,
        {
          folder: "grantLogo",
          fileName,
        }
      );
      // console.log("Upload URL:", response.data.url);
      return response.data.url;
    } catch (error) {
      console.error("Error getting upload URL:", error);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      const uploadUrl = await getUploadUrl(file.name);
      const response = await axios.put(uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });
      if (response.status === 200) {
        console.log("File uploaded successfully");
        return true;
      } else {
        console.log("File upload failed", response);
        return false;
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      return false;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    // console.log( e.target );
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // console.log( formData );
  };


  // add grant data

  const handleAddGrant= async ( e: React.FormEvent ) =>
    {
      e.preventDefault();
      setLoading( true );
      if ( !file )
      {
        setLoading( false );
        return notify( "warn","Please upload a grant logo" );
      }
  
      if ( file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/webp' && file.type !== 'image/gif' && file.type !== 'image/svg' )
      {
        setLoading( false );
        return notify( "warn","Only JPEG, PNG, WEBP, GIF, SVG images are allowed" );
      }
      const token = localStorage.getItem( 'token' );
      if ( token )
      {
  
        try
        {
          const res = await handleUpload();
  
          if ( res )
          {
            if ( !file ) return;
            const path = `https://${ process.env.NEXT_PUBLIC_S3_BUCKET_NAME }.s3.amazonaws.com/grantLogo/${ file.name }`;
  
            const newgrant = {
              title: formData.title,
              description: formData.description,
              organizer: formData.organizer,
              logoUrl: path,
              prize: formData.prize
            };
  
            //add feed
            const response = await axios.post(
              `${ process.env.NEXT_PUBLIC_SERVER_URL }/grant`,
              {
                ...newgrant
              },
              { headers: { Authorization: `Bearer ${ token }` } }
            );
            initailFormData();
            setLoading( false );
            getGrants();
            notify( "success",'grant created successfully' );
          }
        //   router.push('/dashboard');
        } catch ( error )
        {
          console.error( 'Error creating grant:', error );
        }
      }
      else
      {
        console.error( 'Token not found' );
        // router.push( '/admin/login' );
      }
    };


    // update grant

    const handleUpdateGrant = async ( e: React.FormEvent ) =>{
        e.preventDefault();
        setLoading(true);
    
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token not found');
          setLoading(false);
          initailFormData();
          router.push('/admin/login');
        }
    
        try {
          let newfeed;
          if(!file){
            newfeed = {
              title: formData.title,
              description: formData.description,
              organizer: formData.organizer,
              prize: formData.prize
            };
          }
          else{
            if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/webp' && file.type !== 'image/gif' && file.type !== 'image/svg') {
              setLoading(false);
              return notify("warn",'Only JPEG, PNG, WEBP, GIF, SVG images are allowed');
            }
    
            const res = await handleUpload();
            const path = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.amazonaws.com/grantLogo/${file.name}`;
            newfeed = {
              title: formData.title,
              description: formData.description,
              organizer: formData.organizer,
              logoUrl: path,
              prize: formData.prize
            };
          }
            const response = await axios.put(
              `${process.env.NEXT_PUBLIC_SERVER_URL}/grant/${formData?.id}`,
              {
                ...newfeed
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            if(response.status===200){
              initailFormData();
              setLoading(false);
              getGrants();
              notify("success",'grant updated successfully');  
            }
        }
        catch (error) {
          console.error('Error creating blog grant:', error);
        }
      }

    // delete grant
  const handleDeleteGrant = async (id:any) =>{
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found');
      setLoading(false);
      initailFormData();
      router.push('/admin/login');
    }

    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/grant/${id}`, {
        headers: { Authorization: `Bearer ${token}` 
      }
      });
      if(response.status===200){
        initailFormData();
        setLoading(false);
        notify("success",'grant deleted successfully');  
        getGrants();
      }
    }
    catch (error) {
      console.error('Error deleting blog feed:', error);
    }
  }


  return (
    <div className="bg-slate-100">
      <div className="h-screen">
        <div className="p-4 mx-auto w-[80%] flex flex-col justify-center items-center ">
          <div className="w-full flex justify-end items-end">
            <button
              className="border-2 shadow-md text-white font-bold py-2 px-4 rounded-full bg-slate-700 hover:bg-slate-900"
              onClick={() => handleOpen("add", null)}
            >
              <span className="mr-2 text-sm">
                <i className="bi bi-plus-circle"></i>
              </span>
              <span className="text-sm">Add Feed</span>
            </button>
          </div>
          <table className=" w-[80%] bg-white text-black rounded-lg">
            <thead className="p-4 bg-slate-900 rounded-t-lg">
              <tr className="text-white rounded-lg">
                <th className="p-4 border-r text-center">Logo</th>
                <th className="p-4 border-r text-center">Title</th>
                <th className="p-4 border-r text-center">description</th>
                <th className="p-4 border-r text-center"> Organizer</th>
                <th className="p-4 border-r text-center">Prize</th>
                <th className="p-4 text-center ">Actions</th>
              </tr>
            </thead>
            <tbody>
              {grantItems.map((grant: Grant, index: number) => (
                <tr key={grant._id} className="border-b">
                  <td className="p-2 border-r flex justify-center">
                    <img
                      src={grant.logoUrl}
                      alt="Image"
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  </td>
                  <td className="p-2 border-r text-center uppercase">
                    {grant.title}
                  </td>
                  <td className="p-2 border-r text-center">
                    {grant.description}
                  </td>
                  <td className="p-2 border-r text-center uppercase">
                    {grant.organizer}
                  </td>
                  <td className="p-2 border-r text-center">{grant.prize}</td>
                  <td className="p-2">
                    <div className="flex justify-center items-center">
                      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded " onClick={() => handleOpen("edit",grant)}>
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-2" onClick={() => handleDeleteGrant(grant._id)}>
                        <i className="bi bi-trash3"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        backdrop="transparent"
        size="2xl"
        closeButton={false}
        scrollBehavior="outside"
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1  ">
                <div className="text-slate-900 text-center font-bold text-2xl">
                  {editFlag ? "Update  badge" : "Add  badge"}
                </div>
              </ModalHeader>
              <ModalBody className="flex flex-col gap-1 text-black p-8">
                {editFlag ? (
                  // update  badge form
                 
                  <div>
                    <form onSubmit={handleUpdateGrant}>
                      <div className="mb-4">
                        <label
                          htmlFor="title"
                          className="block mb-2 text-sm font-medium  "
                        >
                          Title
                        </label>
                        <input
                          name="title"
                          type="text"
                          id="title"
                          value={ formData.title } onChange={ handleChange }
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="title"
                          required
                        />
                        
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="description"
                          className="block mb-2 text-sm font-medium  "
                        >
                          Description
                        </label>
                        <textarea
                          id="description"
                          rows={4}
                          name="description"
                            value={ formData.description }
                            onChange={ handleChange }
                          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Write your thoughts here"
                          required
                        ></textarea>
                      </div>
                      <div className="mb-4">
                        <label
                          className="block mb-2 text-sm font-medium text-gray-900 "
                          htmlFor="file_input"
                        >
                          Upload file
                        </label>
                        <div
                          {...getRootProps()}
                          className="bg-gray-600 h-28 rounded-lg text-white flex justify-center items-center"
                        >
                          <input {...getInputProps()} />
                          {isDragActive ? (
                            <p>Drop the files here ...</p>
                          ) : (
                            <p>
                              Drag 'n' drop some files here, or click to select
                              files
                            </p>
                          )}
                        </div>
                        <div className="mt-2 text-blue-500 font-bold mx-2">
                          <h2>{ file?.name }</h2>
                        </div>
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="organizer"
                          className="block mb-2 text-sm font-medium  "
                        >
                          Organizer
                        </label>
                        <input
                          type="text"
                          id="organizer"
                            value={ formData.organizer }
                            onChange={ handleChange }
                          name="organizer"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="summary"
                          className="block mb-2 text-sm font-medium "
                        >
                          Prize
                        </label>
                        <input
                          id="prize"
                          type="number"
                          name="prize"
                            value={ formData.prize }
                            onChange={ handleChange }
                          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Write your thoughts here"
                          required
                        ></input>
                      </div>
                      <div className="flex justify-end items-center">
                        {!loading ? (
                          <Button type="submit" color="primary" variant="solid"  onPress={()=>{handleModalClose()}}>
                            Submit
                          </Button>
                        ) : (
                          <BallTriangle />
                        )}
                      </div>
                    </form>
                  </div>
                  
                ) : (
                  <div>
                    <form onSubmit={handleAddGrant}>
                      <div className="mb-4">
                        <label
                          htmlFor="title"
                          className="block mb-2 text-sm font-medium  "
                        >
                          Title
                        </label>
                        <input
                          name="title"
                          type="text"
                          id="title"
                          value={ formData.title } onChange={ handleChange }
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="title"
                          required
                        />
                        
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="description"
                          className="block mb-2 text-sm font-medium  "
                        >
                          Description
                        </label>
                        <textarea
                          id="description"
                          rows={4}
                          name="description"
                            value={ formData.description }
                            onChange={ handleChange }
                          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Write your thoughts here"
                          required
                        ></textarea>
                      </div>
                      <div className="mb-4">
                        <label
                          className="block mb-2 text-sm font-medium text-gray-900 "
                          htmlFor="file_input"
                        >
                          Upload file
                        </label>
                        <div
                          {...getRootProps()}
                          className="bg-gray-600 h-28 rounded-lg text-white flex justify-center items-center"
                        >
                          <input {...getInputProps()} />
                          {isDragActive ? (
                            <p>Drop the files here ...</p>
                          ) : (
                            <p>
                              Drag 'n' drop some files here, or click to select
                              files
                            </p>
                          )}
                        </div>
                        <div className="mt-2 text-blue-500 font-bold mx-2">
                          <h2>{ file?.name }</h2>
                        </div>
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="organizer"
                          className="block mb-2 text-sm font-medium  "
                        >
                          Organizer
                        </label>
                        <input
                          type="text"
                          id="organizer"
                            value={ formData.organizer }
                            onChange={ handleChange }
                          name="organizer"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="summary"
                          className="block mb-2 text-sm font-medium "
                        >
                          Prize
                        </label>
                        <input
                          id="prize"
                          type="number"
                          name="prize"
                            value={ formData.prize }
                            onChange={ handleChange }
                          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Write your thoughts here"
                          required
                        ></input>
                      </div>
                      <div className="flex justify-end items-center">
                        {!loading ? (
                          <Button type="submit" color="primary" variant="solid"  onPress={()=>{handleModalClose()}}>
                            Submit
                          </Button>
                        ) : (
                          <BallTriangle />
                        )}
                      </div>
                    </form>
                  </div>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Grantspage;
