"use client";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { notify } from "@/utils/notify";
import { Button, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@nextui-org/react";
import { BallTriangle } from "react-loader-spinner";
import { useDropzone } from "react-dropzone";

interface Badge {
  _id: string;
  name: string;
  level: string;
  imageUrl: string;
  questCriteria: string;
  taskCriteria: string;
}

const Page = () => {
    const [ formData, setFormData ] = useState( {
        name: '',
        level: '',
        questCriteria: '',
        taskCriteria: '',
        id:''
      } );
  const [file, setFile ] = useState<File | null>( null );
  const [badges, setBadges] = useState<Badge[] | any>([]);
  const [loader, setLoader] = useState(false);
  const router = useRouter();
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [editFlag, setEditFlag] = useState<boolean>(false);

  const initailFormData = () =>{
    setFormData({
      name: '',
      level: '',
      questCriteria: '',
      taskCriteria: '',
      id:''
    });
    setFile(null);
  }

  const handleOpen = (option: string, badge: Badge| null) => {
    initailFormData();
    setLoader(false);
    // console.log('badge:-', badge)
    if(option === 'edit' &&  badge){
      setFormData({
        name:  badge.name,
        level:  badge.level,
        questCriteria:  badge.questCriteria,
        taskCriteria:  badge.taskCriteria,
        id: badge._id,
      });
    }
    setEditFlag(option === 'edit' ? true : false);
    onOpen();
  }
  const handleModalClose = () => {
    initailFormData();
    setLoader(false);
    onClose();
    
  }


//aws apload

  const getUploadUrl = async ( fileName: string ): Promise<string> =>
    {
      try
      {
        const response = await axios.post<{ url: string; }>( `${ process.env.NEXT_PUBLIC_SERVER_URL }/aws/generate-upload-url`, {
          folder: 'BadgesImage',
          fileName,
        } );
        return response.data.url;
      } catch ( error )
      {
        console.error( 'Error getting upload URL:', error );
        throw error;
      }
    };
  
    const handleUpload = async (): Promise<boolean> =>
    {
      if ( !file ) return false;
  
      try
      {
        const uploadUrl = await getUploadUrl( file.name );
        if ( !uploadUrl ) return false;
  
        const res = await axios.put( uploadUrl, file, {
          headers: { 'Content-Type': file.type },
        } );
  
        return res.status === 200;
      } catch ( error )
      {
        console.error( 'Error uploading file:', error );
        return false;
      }
    };

    const onDrop = useCallback( ( acceptedFiles: File[] ) =>
        {
          setFile( acceptedFiles[ 0 ] );
        }, [] );
        const { getRootProps, getInputProps, isDragActive } = useDropzone( { onDrop } );

    //aws end apload

    const handleChange = ( e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ) =>
        {
          const { name, value } = e.target;
          // console.log( e.target );
          setFormData( ( prevData ) => ( {
            ...prevData,
            [ name ]: value
          } ) );
      
          // console.log( formData );
        };

    const handleAddBadges = async ( e: React.FormEvent ) =>
        {
          e.preventDefault();
          setLoader( true );
          if ( !file )
          {
            setLoader( false );
            return notify( "warn","Please upload a badge Image" );
          }
      
          if ( file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/webp' && file.type !== 'image/gif' && file.type !== 'image/svg' )
          {
            setLoader( false );
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
                const path = `https://${ process.env.NEXT_PUBLIC_S3_BUCKET_NAME }.s3.amazonaws.com/BadgesImage/${ file.name }`;
      
                const newbadge = {
                  name: formData.name,
                  level: formData.level,
                  questCriteria: formData.questCriteria,
                  imageUrl: path,
                  taskCriteria: formData.taskCriteria
                };
      
                //add Badge
                const response = await axios.post(
                  `${ process.env.NEXT_PUBLIC_SERVER_URL }/admin/badges`,
                  {
                    ...newbadge
                  },
                  { headers: { Authorization: `Bearer ${ token }` } }
                );
                initailFormData();
                setLoader( false );
                getBadges();
                notify( "success",'badge created successfully' );
              }
              
            } catch ( error )
            {
              console.error( 'Error creating  badge:', error );
            }
          }
          else
          {
            console.error( 'Token not found' );
            router.push( '/admin/login' );
          }
        };



  const getBadges = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/badges`
      );
      setBadges(response.data.badges);
    } catch (error) {
      console.log("error in getting badges:", error);
    }
  };

  // update badges

  const handleUpdateBadge = async ( e: React.FormEvent ) =>{
    e.preventDefault();
    setLoader(true);

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found');
      setLoader(false);
      initailFormData();
      router.push('/admin/login');
    }

    try {
      let newbadge;
      if(!file){
        newbadge = {
          name: formData.name,
          level: formData.level,
          questCriteria: formData.questCriteria,
          taskCriteria: formData.taskCriteria
        };
      }
      else{
        if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/webp' && file.type !== 'image/gif' && file.type !== 'image/svg') {
          setLoader(false);
          return notify("warn",'Only JPEG, PNG, WEBP, GIF, SVG images are allowed');
        }

        const res = await handleUpload();
        const path = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.amazonaws.com/BadgesImage/${file.name}`;
        newbadge = {
          name: formData.name,
          level: formData.level,
          questCriteria: formData.questCriteria,
          imageUrl: path,
          taskCriteria: formData.taskCriteria
        };
      }
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/badges/${formData?.id}`,
          {
            ...newbadge
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if(response.status===200){
          initailFormData();
          setLoader(false);
          getBadges();
          notify("success",'badge updated successfully');  
        }
    }
    catch (error) {
      console.error('Error creating badge:', error);
    }
  }

  // delete badges
  const handleDeleteBadge = async (id: any) => {
    setLoader(true);
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found");
      setLoader(false); 
      router.push("/admin/login");
      notify("warn",'Please login first'); 
      return;
    }

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/badges/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        setLoader(false);
        notify("success",'badge deleted successfully'); 
        getBadges();
      }
    } catch (error) {
      console.error("Error deleting badge:", error);
      setLoader(false);
    }
  };

  useEffect(() => {
    getBadges();
  }, []);

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="h-screen">
        <div className="p-4 mx-auto w-[80%] flex flex-col justify-center items-center">
          <div className="w-full flex justify-end items-end">
            <button className="border-2 shadow-md text-white font-bold py-2 px-4 rounded-full bg-slate-700 hover:bg-slate-900" onClick={()=>handleOpen("add",null)}>
              <span className="mr-2 text-sm">
                <i className="bi bi-plus-circle"></i>
              </span>
              <span className="text-sm">Add Badge</span>
            </button>
          </div>
          <table className="w-[80%] bg-white text-black rounded-lg">
            <thead className="p-4 bg-slate-900 rounded-t-lg">
              <tr className="text-white rounded-lg">
                <th className="p-2 border-r text-center">Image</th>
                <th className="p-2 border-r text-center">Name</th>
                <th className=" py-2 px-0 border-r text-center">questCriteria</th>
                <th className="py-2 px-0 text-center border-r">taskCriteria</th>
                <th className="p-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {badges.map((badge: Badge, index: number) => (
                <tr key={badge._id} className="border-b">
                  <td className="p-2 border-r flex justify-center">
                    <img
                      src={badge.imageUrl}
                      alt={badge.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  </td>
                  <td className="p-2 border-r text-center">{badge.name}</td>
                  <td className="p-2 border-r text-center">{badge.questCriteria}</td>
                  <td className="p-2 border-r text-center">{badge.taskCriteria}</td>
                  <td className="p-2">
                    <div className="flex justify-center items-center">
                      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded" onClick={() => handleOpen("edit",badge)}>
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-2"
                        onClick={() => handleDeleteBadge(badge._id)}
                      >
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
      <Modal backdrop="transparent" size='2xl' closeButton={false} scrollBehavior="outside" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1  ">
              <div className='text-slate-900 text-center font-bold text-2xl'>{editFlag ? 'Update  badge' : 'Add  badge'}</div>
              </ModalHeader>
              <ModalBody className="flex flex-col gap-1 text-black p-8" >
                {
                  editFlag?(
                    // update  badge form
                    <div>
                      <form onSubmit={handleUpdateBadge} >
                        <div className="mb-4">
                          <label
                            htmlFor="title"
                            className="block mb-2 text-sm font-medium  "
                          >
                            Name
                          </label>
                          <input name="name" type="text" id="name" value={ formData.name } onChange={ handleChange }    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Name" required />
                        </div>
                        <div className="mb-4">
                          <label
                            htmlFor="description"
                            className="block mb-2 text-sm font-medium  "
                          >
                           Level
                          </label>
                          <input
                            id="level"
                            type="number"
                            name="level"
                            value={ formData.level }
                            onChange={ handleChange }
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Number"
                            required
                          ></input>
                        </div>
                        
                        <div className="mb-4">
                          <label className="block mb-2 text-sm font-medium text-gray-900 " htmlFor="file_input">Upload file</label>
                          <div { ...getRootProps() } className='bg-gray-600 h-28 rounded-lg text-white flex justify-center items-center'>
                            <input { ...getInputProps() } />
                            {
                              isDragActive ?
                                <p>Drop the files here ...</p> :
                                <p>Drag 'n' drop some files here, or click to select files</p>
                            }
                          </div>
                          <div className='mt-2 text-blue-500 font-bold mx-2'>
                            <h2>{ file?.name }</h2>
                          </div>
                        </div>

                        <div className="mb-4">
                          <label htmlFor='questCriteria' className="block mb-2 text-sm font-medium  ">QuestCriteria</label>
                          <input
                            type="number"
                            id="questCriteria"
                            value={ formData.questCriteria}
                            onChange={ handleChange }
                            name="questCriteria"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            htmlFor="summary"
                            className="block mb-2 text-sm font-medium "
                          >
                          TaskCriteria
                          </label >
                          <input
                            id="taskCriteria"
                            name='taskCriteria'
                            value={ formData.taskCriteria }
                            onChange={ handleChange }
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Nu,ber"
                            required
                          ></input>
                        </div>
                        <div className='flex justify-end items-center'>
                        {
                          !loader ? ( 
                            <Button type="submit" 
                            onPress={handleModalClose} color="primary" variant="solid">
                              Submit
                            </Button>  
                          ) 
                          :
                            <BallTriangle />
                        }
                        </div>
                      </form>
                    </div>
                  ):(

                    <div>
                      <form  onSubmit={ handleAddBadges } > 
                        <div className="mb-4">
                          <label
                            htmlFor="title"
                            className="block mb-2 text-sm font-medium  "
                          >
                            Name
                          </label>
                          <input name="name" type="text" id="title" value={ formData.name } onChange={ handleChange }  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Name" required />
                        </div>
                        <div className="mb-4">
                          <label
                            htmlFor="description"
                            className="block mb-2 text-sm font-medium  "
                          >
                           Level
                          </label>
                          <input
                            id="level"
                            type="number"
                            name="level"
                            value={ formData.level }
                            onChange={ handleChange }
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Enter Number"
                            required
                          ></input>
                        </div>
                        <div className="mb-4">
                          <label className="block mb-2 text-sm font-medium text-gray-900 " htmlFor="file_input">Upload file</label>
                          <div { ...getRootProps() } className='bg-gray-600 h-28 rounded-lg text-white flex justify-center items-center'>
                            <input { ...getInputProps() } />
                            {
                              isDragActive ?
                                <p>Drop the files here ...</p> :
                                <p>Drag 'n' drop some files here, or click to select files</p>
                            }
                          </div>
                          <div className='mt-2 text-blue-500 font-bold mx-2'>
                            <h2>{ file?.name }</h2>
                          </div>
                        </div>
                        <div className="mb-4">
                          <label htmlFor='questCriteria' className="block mb-2 text-sm font-medium  ">QustCriteria</label>
                          <input
                            type="number"
                            id="questCriteria"
                            value={ formData.questCriteria }
                            onChange={ handleChange }
                            name="questCriteria"
                            placeholder="Enter Number"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            htmlFor="taskCriteria"
                            className="block mb-2 text-sm font-medium "
                          >
                         taskCriteria
                          </label>
                          <input
                            id="taskCriteria"
                            type="number"
                            name='taskCriteria'
                            value={ formData.taskCriteria }
                            onChange={ handleChange }
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Enter Number"
                            required
                          ></input>
                        </div>
                        <div className='flex justify-end items-center'>
                        {
                          !loader ? ( 
                          <Button type='submit' color="primary" variant="solid" onPress={()=>{handleModalClose()}}>
                              Submit
                          </Button>  
                          ) :
                            <BallTriangle />
                        }

                        </div>
                      </form>
                    </div>
                    
                  )
                }
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Page;
