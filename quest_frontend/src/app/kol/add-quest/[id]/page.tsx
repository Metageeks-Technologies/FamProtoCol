"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createQuest1, Reward } from '@/redux/reducer/questSlice';
import { RootState, AppDispatch } from '@/redux/store';
import { useParams, useRouter } from 'next/navigation';
import { notify } from '@/utils/notify';
import axios from 'axios';
import Multiselect from 'multiselect-react-dropdown';
import { getCommunitySuccess } from '@/redux/reducer/adminCommunitySlice';

interface Category
{
  _id: string;
  name: string;
}

interface Ecosystem
{
  _id: string;
  name: string;
}

interface CommunityData
{
  categories: Category[];
  ecosystems: Ecosystem[];
}
function CreateQuest ()
{
  const fileInputRef = useRef<HTMLInputElement>( null );
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [ logoPreview, setLogoPreview ] = useState<string | null>( null );
  const [ logo, setLogo ] = useState<File | null>( null );
  const [ categories, setCategories ] = useState<[]>( [] );
  const { loading, error } = useSelector( ( state: RootState ) => state.quest );
  const creator = useSelector<RootState>( ( state ) => state?.login.user?._id );
  const communityData = useSelector<RootState, CommunityData>( ( state: any ) => state.adminCommunity );


  const [ title, setTitle ] = useState<string>( '' );
  const [ description, setDescription ] = useState<string>( '' );
  const [ rewards, setRewards ] = useState<Reward[]>( [
    { type: 'xp', value: 0 },
    { type: 'coin', value: 0 }
  ] );
  const [ isSubmitting, setIsSubmitting ] = useState( false );

  const { id: communityId } = useParams();

  const handleRewardChange = useCallback( ( index: number, value: number ) =>
  {
    setRewards( prev => prev.map( ( reward, i ) =>
      i === index ? { ...reward, value } : reward
    ) );
  }, [] );

  const getUploadUrl = useCallback( async ( fileName: string ): Promise<string> =>
  {
    try
    {
      const response = await axios.post<{ url: string; }>( `${ process.env.NEXT_PUBLIC_SERVER_URL }/aws/generate-upload-url`, {
        folder: 'questLogo',
        fileName,
      } );
      return response.data.url;
    } catch ( error )
    {
      console.error( 'Error getting upload URL:', error );
      throw error;
    }
  }, [] );

  const handleUpload = useCallback( async (): Promise<boolean> =>
  {
    if ( !logo ) return false;

    try
    {
      const uploadUrl = await getUploadUrl( logo.name );
      if ( !uploadUrl ) return false;

      const res = await axios.put( uploadUrl, logo, {
        headers: { 'Content-Type': logo.type },
      } );

      return res.status === 200;
    } catch ( error )
    {
      console.error( 'Error uploading file:', error );
      return false;
    }
  }, [ logo, getUploadUrl ] );

  const handleSubmit = useCallback( async ( e: React.FormEvent ) =>
  {
    e.preventDefault();
    if ( !logo )
    {
      return notify( "warn", "Please upload Your profile" );
    }

    if ( ![ 'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml' ].includes( logo.type ) )
    {
      return notify( "warn", "Only JPEG, PNG, WEBP, GIF, SVG images are allowed" );
    }

    setIsSubmitting( true );

    try
    {
      const uploadSuccess = await handleUpload();
      if ( !uploadSuccess )
      {
        setIsSubmitting( false );
        return notify( "error", "Failed to upload image" );
      }

      const path = `https://${ process.env.NEXT_PUBLIC_S3_BUCKET_NAME }.s3.amazonaws.com/questLogo/${ logo.name }`;
      const newQuest = { title, description, type: 'DAILY', status: 'NOT_STARTED', rewards, community: communityId, creator, logo: path, categories };

      const resultAction = await dispatch( createQuest1( newQuest ) );

      if ( createQuest1.fulfilled.match( resultAction ) )
      {
        notify( "success", 'Quest created successfully' );
        setTitle( '' );
        setDescription( '' );
        setLogo( null );
        router.push( `/kol/quest/${ resultAction.payload.newQuest._id }` );
      } else
      {
        notify( "error", 'Failed to create quest' );
      }
    } catch ( err )
    {
      console.error( 'Error creating quest:', err );
      notify( "error", 'An error occurred while creating the quest' );
    } finally
    {
      setIsSubmitting( false );
    }
  }, [ title, description, rewards, communityId, creator, logo, dispatch, router, handleUpload ] );

  const handleLogoUpload = useCallback( ( event: React.ChangeEvent<HTMLInputElement> ) =>
  {
    const file = event.target.files?.[ 0 ];
    if ( file )
    {
      setLogo( file );
      const reader = new FileReader();
      reader.onload = ( e ) =>
      {
        setLogoPreview( e.target?.result as string );
      };
      reader.readAsDataURL( file );
    }
  }, [] );

  const handleLogoClick = useCallback( () =>
  {
    fileInputRef.current?.click();
  }, [] );

  useEffect( () =>
  {
    dispatch( getCommunitySuccess() );
  },[]) 

  return (
    <div className="min-h-screen text-white bg-gradient-to-r from-black via-slate-900 to-slate-900 flex flex-col items-center justify-center py-10 px-5">
      <div className="bg-[#00000067] mt-10 p-10 rounded-xl shadow-xl w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">Create New Quest</h1>
        <form onSubmit={ handleSubmit }>
          <div className='flex mb-5'>
            <div className="w-full sm:w-1/3 flex justify-center sm:block">
              <div
                className="bg-gray-950 border border-gray-600 h-28 w-28 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-300 hover:border-purple-500"
                onClick={ handleLogoClick }
              >
                { logoPreview ? (
                  <img src={ logoPreview } alt="Uploaded logo" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <img src="https://clusterprotocol2024.s3.amazonaws.com/others/gallery-add.png" alt="upload image" />
                  </div>
                ) }
              </div>
              <input
                type="file"
                ref={ fileInputRef }
                onChange={ handleLogoUpload }
                accept="image/*"
                className="hidden"
              />
            </div>
            <div className="mx-5 w-full">
              <label className="block text-gray-300 font-semibold mb-2">Title</label>
              <input
                type="text"
                value={ title }
                onChange={ ( e ) => setTitle( e.target.value ) }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-300 bg-gray-800 text-white"
                required
              />
            </div>
          </div>
          <div className="mb-5">
            <label className="block text-gray-300 font-semibold mb-2">Description</label>
            <textarea
              value={ description }
              onChange={ ( e ) => setDescription( e.target.value ) }
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-300 bg-gray-800 text-white"
              rows={ 4 }
              required
            />
          </div>
          <div className="mb-5">
            <label className="block text-gray-300 font-semibold mb-2">
              Categories (Select multiple)*
            </label>
            <Multiselect
              options={ communityData?.categories?.map( category => ( {
                name: category?.name,
                id: category._id
              } ) ) || [ "No category found" ] }
              selectedValues={ categories }
              onSelect={ ( selectedList ) => setCategories( selectedList ) }
              onRemove={ ( selectedList ) => setCategories( selectedList ) }
              displayValue="name"
              placeholder="Select Categories"
              style={ {
                chips: {
                  background: '#9333ea',
                  color: '#ffffff'
                },
                searchBox: {
                  border: '1px solid #4b5563',
                  borderRadius: '0.5rem',
                  background: '#1f2937',
                  color: 'white'
                },
                option: {
                  color: 'white',
                  background: '#1f2937'
                },
                optionContainer: {
                  background: '#1f2937'
                },
                groupHeading: {
                  background: '#1f2937',
                  color: 'white'
                }
              } }
              className="w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-300 text-sm text-white"
              showCheckbox={ false }
              avoidHighlightFirstOption={ true }
              hideSelectedList={ false }
            />
          </div>
          <div className="mb-5">
            <label className="block text-gray-300 font-semibold mb-2">Rewards</label>
            { rewards.map( ( reward, index ) => (
              <div key={ index } className="flex items-center mt-2">
                <label
                  className="w-1/2 px-4 py-2 border rounded-l-lg bg-gray-800 text-white"
                >
                  { reward.type }
                </label>
                <input
                  type="number"
                  onChange={ ( e ) => handleRewardChange( index, parseInt( e.target.value )>500?500:parseInt( e.target.value ) ) }
                  placeholder="Value"
                  min={1}
                  max={500}
                  className="w-1/2 px-4 py-2 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-300 bg-gray-800 text-white"
                  required
                />
              </div>
            ) ) }
          </div>
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              disabled={ isSubmitting }
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              { isSubmitting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </div>
              ) : (
                'Submit'
              ) }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateQuest;