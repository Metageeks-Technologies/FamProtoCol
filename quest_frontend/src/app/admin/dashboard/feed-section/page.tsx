"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { BallTriangle } from "react-loader-spinner";
// import {Button} from "@nextui-org/react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import { notify } from '@/utils/notify';


interface Feed {
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
    author: string;
    summary: string;
}
const AddFeedPage = () =>
{
  const [ formData, setFormData ] = useState( {
    title: '',
    description: '',
    author: '',
    summary: '',
    id:''
  } );
  const [file, setFile ] = useState<File | null>( null );
  const [feeds, setFeeds] = useState<Feed[] | any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loader, setLoader ] = useState<boolean>( false );
  const [editFlag, setEditFlag] = useState<boolean>(false);
  let limit=10;
  
  const router = useRouter();
  const {isOpen, onOpen, onClose} = useDisclosure();
  
  const initailFormData = () =>{
    setFormData({
      title: '',
      description: '',
      author: '',
      summary: '',
      id:''
    });
    setFile(null);
  }
  const handleOpen = (option: string, feed: Feed| null) => {
    initailFormData();
    setLoader(false);
    // console.log('feed:-',feed)
    if(option === 'edit' && feed){
      setFormData({
        title: feed.title,
        description: feed.description,
        author: feed.author,
        summary: feed.summary,
        id:feed._id,
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
  const getFeeds = async () =>
  {
    try
    {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL }/feed`,{
        params: {
          page: currentPage,
          limit: limit, // Example limit
        },
     });
    //  console.log(response.data);
      setFeeds(response.data.feeds);
      setTotalPages(response.data.totalPages);

      // console.log('feed items :-',response.data)
      setLoader(false)
    } catch (error) {
      console.log('error in getting feed :-',error)
    }
  };

  useEffect(() => {
    getFeeds();
  }, [currentPage]);


  //dropzone for file uploading
  const onDrop = useCallback( ( acceptedFiles: File[] ) =>
  {
    setFile( acceptedFiles[ 0 ] );
  }, [] );
  const { getRootProps, getInputProps, isDragActive } = useDropzone( { onDrop } );

  const getUploadUrl = async ( fileName: string ) =>
  {
    try
    {
      const response = await axios.post( `${ process.env.NEXT_PUBLIC_SERVER_URL }/aws/generate-upload-url`, {
        folder: 'feedImage',
        fileName,
      } );
      // console.log( 'Upload URL:', response.data.url );
      return response.data.url;
    } catch ( error )
    {
      console.error( 'Error getting upload URL:', error );
    }

  };

  const handleUpload = async () =>
  {
    if ( !file ) return;

    try
    {
      const uploadUrl = await getUploadUrl( file.name );
      const response = await axios.put( uploadUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
      } );
      if ( response.status === 200 )
      {
        // console.log( 'File uploaded successfully' );
        return true;
      }
      else
      {
        console.log( 'File upload failed', response );
        return false;
      }
    } catch ( error )
    {
      console.error( 'Error uploading file:', error );
      return false;
    }
  };

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

  // submit for creating the feed
  const handleAddFeed = async ( e: React.FormEvent ) =>
  {
    e.preventDefault();
    setLoader( true );
    if ( !file )
    {
      setLoader( false );
      return notify( "warn","Please upload a community logo" );
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
          const path = `https://${ process.env.NEXT_PUBLIC_S3_BUCKET_NAME }.s3.amazonaws.com/feedImage/${ file.name }`;

          const newfeed = {
            title: formData.title,
            description: formData.description,
            author: formData.author,
            imageUrl: path,
            summary: formData.summary
          };

          //add feed
          const response = await axios.post(
            `${ process.env.NEXT_PUBLIC_SERVER_URL }/admin/add-feed`,
            {
              ...newfeed
            },
            { headers: { Authorization: `Bearer ${ token }` } }
          );
          initailFormData();
          setLoader( false );
          getFeeds();
          notify( "success",'Blog feed created successfully' );
        }
        // router.push('/dashboard');
      } catch ( error )
      {
        console.error( 'Error creating blog feed:', error );
      }
    }
    else
    {
      console.error( 'Token not found' );
      router.push( '/admin/login' );
    }
  };
  //submit for update the feed
  const handleUpdateFeed = async ( e: React.FormEvent ) =>{
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
      let newfeed;
      if(!file){
        newfeed = {
          title: formData.title,
          description: formData.description,
          author: formData.author,
          summary: formData.summary
        };
      }
      else{
        if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/webp' && file.type !== 'image/gif' && file.type !== 'image/svg') {
          setLoader(false);
          return notify("warn",'Only JPEG, PNG, WEBP, GIF, SVG images are allowed');
        }

        const res = await handleUpload();
        const path = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.amazonaws.com/feedImage/${file.name}`;
        newfeed = {
          title: formData.title,
          description: formData.description,
          author: formData.author,
          imageUrl: path,
          summary: formData.summary
        };
      }
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/feed/${formData?.id}`,
          {
            ...newfeed
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if(response.status===200){
          initailFormData();
          setLoader(false);
          getFeeds();
          notify("success",'Blog feed updated successfully');  
        }
    }
    catch (error) {
      console.error('Error creating blog feed:', error);
    }
  }

  //submit for delete the feed
  const handleDeleteFeed = async (id:any) =>{
    setLoader(true);
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found');
      setLoader(false);
      initailFormData();
      router.push('/admin/login');
    }

    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/feed/${id}`, {
        headers: { Authorization: `Bearer ${token}` 
      }
      });
      if(response.status===200){
        initailFormData();
        setLoader(false);
        notify("success",'Blog feed deleted successfully');  
        getFeeds();
      }
    }
    catch (error) {
      console.error('Error deleting blog feed:', error);
    }
  }

  return (
    <>
      <div className="bg-slate-100 " id='edit-feed'>  
        <div className='h-screen'>
          <div className='p-4 mx-auto w-[80%] flex flex-col justify-center items-center '>
            <div className='w-full flex justify-end items-end'>
              <button className='border-2 shadow-md text-white font-bold py-2 px-4 rounded-full bg-slate-700 hover:bg-slate-900' onClick={()=>handleOpen("add",null)} >
                <span className='mr-2 text-sm'>
                  <i className="bi bi-plus-circle"></i>
                </span>
                <span className='text-sm' >Add Feed
                </span>
              </button>
            </div>
            <table className=" w-[80%] bg-white text-black rounded-lg">
              <thead className='p-4 bg-slate-900 rounded-t-lg'>
                <tr className="text-white rounded-lg">
                  <th className='p-4 border-r text-center'>S.No</th>
                  <th className='p-4 border-r text-center'>Title</th>
                  <th className='p-4 border-r text-center'>Author</th>
                  <th className='p-4 text-center '>Actions</th>
                </tr>
              </thead>
              <tbody>
                {feeds.map((feed:Feed, index:number) => (
                  <tr key={index} className={`${index!=limit-1 ? 'border-b' : ''} p-4 m-2`}>
                    <td className='p-2 text-center border-r '>{index+1}</td>
                    <td className='p-2 border-r '>{feed.title}</td>
                    <td className='p-2 border-r '>{feed.author}</td>
                    <td className='p-2'>
                    <div className='flex justify-center items-center'>
                      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded " onClick={() => handleOpen("edit",feed)}><i className="bi bi-pencil-square"></i></button>
                      <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-2" onClick={() => handleDeleteFeed(feed._id)}><i className="bi bi-trash3"></i></button>
                    </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='flex justify-center items-center gap-4 mt-5 '>
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className='border hover:shadow-md bg-slate-600 hover:bg-slate-800  text-white font-bold py-2 px-4 rounded-full'>
                Prev
              </button>
              <span className='text-black'>{currentPage}</span>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className='border hover:shadow-md bg-slate-600 hover:bg-slate-800  text-white font-bold py-2 px-4 rounded-full'>Next</button>
            </div>
          </div>
          </div>
          <div className="flex flex-wrap bg-red-600 gap-3">
      </div>
      <Modal backdrop="transparent" size='2xl' closeButton={false} scrollBehavior="outside" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1  ">
              <div className='text-slate-900 text-center font-bold text-2xl'>{editFlag ? 'Update Feed' : 'Add Feed'}</div>
              </ModalHeader>
              <ModalBody className="flex flex-col gap-1 text-black p-8" >
                {
                  editFlag?(
                    // update feed form
                    <div>
                      <form onSubmit={ handleUpdateFeed }>
                        <div className="mb-4">
                          <label
                            htmlFor="title"
                            className="block mb-2 text-sm font-medium  "
                          >
                            Title
                          </label>
                          <input name="title" type="text" id="title" value={ formData.title } onChange={ handleChange } className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="title" required />
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
                            rows={ 4 }
                            name="description"
                            value={ formData.description }
                            onChange={ handleChange }
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Write your thoughts here"
                            required
                          ></textarea>
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
                          <label htmlFor='author' className="block mb-2 text-sm font-medium  ">Author</label>
                          <input
                            type="text"
                            id="author"
                            value={ formData.author }
                            onChange={ handleChange }
                            name="author"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            htmlFor="summary"
                            className="block mb-2 text-sm font-medium "
                          >
                          Content
                          </label>
                          <textarea
                            id="summary"
                            rows={ 4 }
                            name='summary'
                            value={ formData.summary }
                            onChange={ handleChange }
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Write your thoughts here"
                            required
                          ></textarea>
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
                    // add feed form
                    <div>
                      <form onSubmit={ handleAddFeed }>
                        <div className="mb-4">
                          <label
                            htmlFor="title"
                            className="block mb-2 text-sm font-medium  "
                          >
                            Title
                          </label>
                          <input name="title" type="text" id="title" value={ formData.title } onChange={ handleChange } className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="title" required />
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
                            rows={ 4 }
                            name="description"
                            value={ formData.description }
                            onChange={ handleChange }
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Write your thoughts here"
                            required
                          ></textarea>
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
                          <label htmlFor='author' className="block mb-2 text-sm font-medium  ">Author</label>
                          <input
                            type="text"
                            id="author"
                            value={ formData.author }
                            onChange={ handleChange }
                            name="author"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            htmlFor="summary"
                            className="block mb-2 text-sm font-medium "
                          >
                          Content
                          </label>
                          <textarea
                            id="summary"
                            rows={ 4 }
                            name='summary'
                            value={ formData.summary }
                            onChange={ handleChange }
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Write your thoughts here"
                            required
                          ></textarea>
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
    </>
  );
};

export default AddFeedPage;
