"use client";
import React, { useEffect, useState,useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDropzone } from 'react-dropzone';
import {Modal,Pagination, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure,Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip, Tooltip, ChipProps, getKeyValue} from "@nextui-org/react";
import { notify } from "@/utils/notify";
import { Spinner } from "@nextui-org/react";
type Props = {};

type ICategory = {
  _id:string;
  name: string;
  imageUrl: string;
};
type IEcosystem = {
  _id:string;
  name: string;
  imageUrl: string;
};

const categoryColumns = [
  {name:"Image",uid:"imageUrl"},
  {name: "Category", uid: "name"},
  {name: "Actions", uid: "actions"},
];
const ecosystemColumns = [
  {name:"Image",uid:"imageUrl"},
  {name: "Ecosystem", uid: "name"},
  {name: "Actions", uid: "actions"},
];

const CommunityDataPage = (props: Props) => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [ecosystems, setEcosystems] = useState<IEcosystem[]>([]);
  const [description, setDescription] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newEcosystem, setNewEcosystem] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [loader,setLoader]=useState(false);
  const [modalView, setModalView] = useState<string>("");
  const [preview, setPreview] = useState<string|null>(null);
  const [CategoryPage, setCategoryPage] = React.useState(1);
  const [EcosystemPage, setEcosystemPage] = React.useState(1);
  const [selectedData, setSelectedData] = useState({
    type:"",
    _id:"",
    name:"",
    imageUrl:"",

  });
  const router = useRouter();
  
  const rowsPerPage = 5;

  const CategoryPages = Math.ceil(categories.length / rowsPerPage);

  const CategoryItems = React.useMemo(() => {
    const start = (CategoryPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return categories.slice(start, end);
  }, [CategoryPage, categories]);

  const EcosystemPages = Math.ceil(ecosystems.length / rowsPerPage);

  const EcosystemItems = React.useMemo(() => {
    const start = (EcosystemPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return ecosystems.slice(start, end);
  }, [EcosystemPage, ecosystems]);


  const renderCell = React.useCallback((data: any, columnKey: React.Key,type:string) => {
    const cellValue = data[columnKey as keyof any];

    switch (columnKey) {
      case "imageUrl":
        return (
          <div className="flex items-center justify-start">
            <div className="w-10 h-10 ">
          <img src={cellValue} alt={data.name} className="w-full h-full" />
          </div>
          </div>
        )
      ;
      case "name":
        return (
          <div className="flex items-center justify-start">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
          </div>
        );
      case "actions":
        return (
          <div className="flex items-center justify-center">
          <div className="relative flex items-center gap-2">
            <Tooltip color="primary" content="Details">
              <button onClick={()=>{handleEdit(type,data)}}  className="text-lg text-default-400 cursor-pointer active:opacity-50" >
               <i className="bi bi-eye"></i>
              </button>
            </Tooltip>
            <Tooltip color="danger" content="Delete">
              <button onClick={() => handleDelete(type,data._id)} className="text-lg text-danger cursor-pointer active:opacity-50">
              <i className="bi bi-trash"></i>
              </button>
            </Tooltip>
          </div>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  //dropzone for file uploading
  const onDrop = useCallback( ( acceptedFiles: File[] ) =>
  {
    setFile( acceptedFiles[ 0 ] );
    const reader:any = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL( acceptedFiles[ 0 ] );
  }, [] );
  const { getRootProps, getInputProps, isDragActive } = useDropzone( { onDrop } );
  
  const initialize=()=>{
    setFile(null);
    setPreview(null);
    setNewCategory("");
    setNewEcosystem("");
    setDescription("");
    setSelectedData({
      type:"",
      _id:"",
      name:"",
      imageUrl:"",

    });
    setLoader(false);
  }

  const handleEdit=(type:string,data:any)=>{
    setSelectedData((prev)=>({
      ["type"]:type,["_id"]:data._id,["name"]:data.name,["imageUrl"]:data.imageUrl,
    }));
    setPreview(data.imageUrl);
    handleModalOpen(`${type}Edit`);
  }
  const handleModalOpen=(type:string)=>{
    setModalView(type);
    setSelectedData((prev)=>({...prev,["type"]:type}));
    onOpen();
  }

  const handleModalClose=()=>{
    initialize();
    onClose();
  }
  const getUploadUrl = async (fileName: string ) =>
  {
    if( !file ) return;
    try
    {
      const response = await axios.post( `${ process.env.NEXT_PUBLIC_SERVER_URL }/aws/generate-upload-url`, {
        folder: selectedData.type,
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
      const uploadUrl = await getUploadUrl(file.name );
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
        // console.log( 'File upload failed', response );
        return false;
      }
    } catch ( error )
    {
      console.error( 'Error uploading file:', error );
      return false;
    }
  };

  const handleAdd=async(e:any)=>{
    e.preventDefault();
    setLoader(true);
    const token = localStorage.getItem("token");
    if(!token){
      notify("warn","Please login first");
      router.push("/admin/login");
      return;
    }
    try {
      if(!file){
        notify("error","Please upload image");
        return;
      }
       if(file?.type !== 'image/jpeg'&& file?.type !== 'image/avif' && file?.type !== 'image/png' && file?.type !== 'image/webp' && file?.type !== 'image/gif' && file?.type !== 'image/svg' ){
          notify("error","File format not supported");
          return;
        }

        const res=await handleUpload();
        if(res){
        const path = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.amazonaws.com/${selectedData.type}/${file?.name}`
        const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/addCommunityData`,{
          name:selectedData.name,
          imageUrl:path,
          type:selectedData.type
        });

          notify("success",response.data.message);
          setNewCategory("");
          setPreview(null);
          setFile(null);
          onClose();
          fetchCategories();
        }
    } catch (error) {
      notify("error","Something went wrong");
      console.log(error);
    }
  }

  const handleUpdate=async(e:any)=>{
    e.preventDefault();
    setLoader(true);
    const token = localStorage.getItem("token");
    if(!token){
      notify("warn","Please login first");
      router.push("/admin/login");
      return;
    }
    try {
      let newData;
      if(!file){
        newData = {
          name:selectedData.name
        }
      }
      else{
        if(file?.type !== 'image/jpeg'&& file?.type !== 'image/avif' && file?.type !== 'image/png' && file?.type !== 'image/webp' && file?.type !== 'image/gif' && file?.type !== 'image/svg' ){
          notify("error","File format not supported");
          return;
        }
        const res=await handleUpload();
        if(res){
        const path = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.amazonaws.com/${selectedData.type}/${file?.name}`
        newData = {
          name:selectedData.name,
          imageUrl:path
        }
      }
      }
        const response = await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/metadata/${selectedData.type}/${selectedData._id}`,{
          ...newData
        });
        
          notify("success",response.data.message);
          setNewCategory("");
          setPreview(null);
          setFile(null);
          onClose();
          fetchCategories();
      
    } catch (error) {
      notify("error","Something went wrong");
      console.log(error);
    }
  }
  
  const handleDelete = async (type:string,id:string) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/metadata/${type}/${id}`
      );
      // console.log(response.data);
      notify("success",response.data.message);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

   const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/getCommunityData`
        );
        // console.log(response.data);
        setEcosystems(response.data.community.ecosystems);
        setCategories(response.data.community.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
  useEffect(() => {
    fetchCategories();
  }, [])

  return (
    <div className="bg-slate-100 text-black min-h-screen p-8">
      <div className="py-10 mx-auto w-[80%] rounded-lg bg-white">
      <div className="flex justify-center mb-6 p-4 py-6">
        < h2 className="text-4xl font-bold ">Edit Community MetaData</h2>
      </div>
        {/* category table */}

    <div className="my-4 p-4 w-[80%] mx-auto">
        <div className="mb-2 flex justify-end items-center">
         <Button color="primary" onClick={()=>handleModalOpen("category")}>Add Categories</Button>
        </div>
      <Table aria-label="Example table with custom cells"
      bottomContent={
        <div className="flex w-full justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            color="secondary"
            page={CategoryPage}
            total={CategoryPages}
            onChange={(page) => setCategoryPage(page)}
          />
        </div>
      }
      >
        <TableHeader columns={categoryColumns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={CategoryItems}>
          {(item: ICategory) => (
            <TableRow key={item._id }>
              {(columnKey) => <TableCell>{renderCell(item, columnKey,"category")}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>


      {/* ecosystem table */}
    <div className="my-4 p-4 w-[80%] mx-auto ">

    <div className="mb-2 flex justify-end items-center">
          <Button color="primary" onClick={()=>handleModalOpen("ecosystem")}>Add Ecosystem</Button>
        </div>
      <Table  aria-label="Example table with custom cells"
       bottomContent={
        <div className="flex w-full justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            color="secondary"
            page={EcosystemPage}
            total={EcosystemPages}
            onChange={(page) => setEcosystemPage(page)}
          />
        </div>
      }>
        <TableHeader columns={ecosystemColumns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={EcosystemItems}>
          {(item: IEcosystem) => (
            <TableRow key={item._id }>
              {(columnKey) => <TableCell>{renderCell(item, columnKey,"ecosystem")}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  </div>
  
      <Modal backdrop="blur" isOpen={isOpen} onClose={handleModalClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1"></ModalHeader>
              <ModalBody className="text-black">
               {
                modalView === "category" && (
                    <form id="addCategroyForm" onSubmit={(e) => {handleAdd(e)}}>
                    <div className="mb-4">
                    <div className="flex justify-between items-center mb-4">
               <div className="w-32 h-32 border rounded flex items-center justify-center bg-gray-50">
          {preview ? (
            <img
              src={preview}
              alt="Image Preview"
              className="max-w-full max-h-full"
            />
          ) : (
            <span className="text-gray-500">Image Preview</span>
          )}
              </div>
            <div>   
          <label
            htmlFor="addCategory"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Category Name
          </label>          
            <input
              id="addCategory"
              name="addCategory"
              type="text"
              required
              value={selectedData.name}
              onChange={(e) => setSelectedData({ ...selectedData, name: e.target.value })}
              placeholder="New Category"
              className="rounded-lg border border-gray-300 p-2 text-sm text-black"
            />
           </div>
           </div>
            <div className="flex justify-between items-center">
            <div {...getRootProps()} className="w-32 border-2 border-gray-800 justify-center items-center text-black p-1 rounded-md">
                 <label htmlFor="addCategoryImage">Upload Image</label>
                <input {...getInputProps()} name="addCategoryImage" id="addCategoryImage" type="file" required   style={{ display: 'none' }}/>
                {
                 
                }
              </div>
          
           <div className="flex justify-center items-baseline">
            <button
              className="bg-blue-500 rounded-3xl px-4 py-2 text-white text-sm"
              type="submit"
            >
             Submit
            </button>
            </div>
            </div>
          </div>
            </form>
                )
               }
               {
                modalView === "ecosystem" && (
                   <form id="addEcosystemForm" onSubmit={(e) => {handleAdd(e)}}>
           <div className="mb-4">
           <div className="flex justify-between items-center mb-4">
             <div className="w-32 h-32 border rounded flex items-center justify-center bg-gray-50">
          {preview!=="" && preview!=null ? (
            <img
              src={preview}
              alt="Image Preview"
              className="max-w-full max-h-full"
            />
          ) : (
            <span className="text-gray-500">Image Preview</span>
          )}
        </div>
        <div>
          <label
            htmlFor="addEcosystem"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Ecosystem Name
          </label>          
            <input
              id="addEcosystem"
              name="addEcosystem"
              type="text"
              required
              value={selectedData.name}
              onChange={(e) => setSelectedData({ ...selectedData, name: e.target.value })}
              placeholder="New Ecosystem"
              className="rounded-lg border border-gray-300 p-2 text-sm text-black"
            />
           </div>
           </div>
           <div className="flex justify-between items-center mb-4">
           <div {...getRootProps()} className="w-32 border-2 border-gray-800 justify-center items-center text-black p-1 rounded-md">
                <label htmlFor="ecosystemImage">Upload Image</label>
                <input name="ecosystemImage" {...getInputProps()} required id="ecosystemImage" type="file" style={{ display: 'none' }}/>
                {
                // <p className="text-center">Upload Image</p>
                }
              </div>
              
          
           <div className="flex justify-center items-baseline">
            <button
              className="bg-blue-500 rounded-3xl px-4 py-2 text-white text-sm"
              type="submit"
            >
              Submit
            </button>
            </div>
            </div>
          </div>
            </form>
                )
               }
               {
                modalView === "categoryEdit" && (

                      <form id="editCategoryForm" onSubmit={(e) => {handleUpdate(e)}}>
                      <div>category edit</div>
                    <div className="mb-4">
                    <div className="flex justify-between items-center mb-4">
               <div className="w-32 h-32 border rounded flex items-center justify-center bg-gray-50">
          {preview ? (
            <img
              src={preview}
              alt="Image Preview"
              className="max-w-full max-h-full"
            />
          ) : (
            <span className="text-gray-500">Image Preview</span>
          )}
              </div>
            <div>   
          <label
            htmlFor="editCategory"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Category Name
          </label>          
            <input
              id="editCategory"
              name="editCategory"
              type="text"
              value={selectedData.name}
              onChange={(e) => setSelectedData({ ...selectedData, name: e.target.value })}
              placeholder="New Category"
              className="rounded-lg border border-gray-300 p-2 text-sm text-black"
            />
           </div>
           </div>
            <div className="flex justify-between items-center">
            <div {...getRootProps()} className="w-32 border-2 border-gray-800 justify-center items-center text-black p-1 rounded-md">
                <label htmlFor="categoryEditImage">Upload Image</label>
                <input {...getInputProps()} name="categoryEditImage" id="categoryEditImage" type="file" style={{display:"none"}} />
                {
                  // <p className="text-center">Upload Image</p>
                }
              </div>
          
           <div className="flex justify-center items-baseline">
            <button
              className="bg-blue-500 rounded-3xl px-4 py-2 text-white text-sm"
              type="submit"
            
            >
             Submit
            </button>
            </div>
            </div>
          </div>
            </form>
                )
               }
               {
                modalView === "ecosystemEdit" && (

                     <form id="editEcosystemForm" onSubmit={(e) => {handleUpdate(e)}}>
           <div className="mb-4">
           <div className="flex justify-between items-center mb-4">
             <div className="w-32 h-32 border rounded flex items-center justify-center bg-gray-50">
          {preview!=="" && preview!=null ? (
            <img
              src={preview}
              alt="Image Preview"
              className="max-w-full max-h-full"
            />
          ) : (
            <span className="text-gray-500">Image Preview</span>
          )}
        </div>
        <div>
          <label
            htmlFor="editEcosystem"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Ecosystem Name
          </label>          
            <input
              id="editEcosystem"
              name="editEcosystem"
              type="text"
              value={selectedData.name}
              onChange={(e) => setSelectedData({ ...selectedData, name: e.target.value })}
              placeholder="New Ecosystem"
              className="rounded-lg border border-gray-300 p-2 text-sm text-black"
            />
           </div>
           </div>
           <div className="flex justify-between items-center mb-4">
           <div {...getRootProps()} className="w-32 border-2 border-gray-800 justify-center items-center text-black p-1 rounded-md">
                <input {...getInputProps()} name="ecosystemEditImage"/>
                {
                <p className="text-center">Upload Image</p>
                }
              </div>
              
          
           <div className="flex justify-center items-baseline">
            <button
              className="bg-blue-500 rounded-3xl px-4 py-2 text-white text-sm"
              type="submit"
            >
              Submit
            </button>
            </div>
            </div>
          </div>
            </form>
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

export default CommunityDataPage;
