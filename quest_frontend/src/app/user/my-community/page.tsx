
"use client";
import { fetchUserData } from "@/redux/reducer/authSlice";
import { fetchCommunitiesByIds } from "@/redux/reducer/communitySlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaUser, FaBolt, FaTwitter, FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Pagination } from "@nextui-org/react";
import CommunityCard from "@/app/components/HomeCard/CommunityCard"
import { CommunityCardType } from "@/types/types";

const MyCommunities: React.FC = () =>
{
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const userCommunities = useSelector( ( state: RootState ) => state.community.userCommunities );
  const userCommunityIds = useSelector( ( state: RootState ) => state.login.user?.community );
  const temp = useSelector( ( state: RootState ) => ( state?.login?.user?.createdCommunities ) );
  const [createdCommunity, setCreatedCommunity ] = useState( [] );
  const [filteredCreatedCommunity,setFilteredCreatedCommunity] = useState([]);
  const [currentPageCreatedCommunity,setCurrentPageCreatedCommunity] = useState(1);
  const [totalPagesCreatedCommunity,setTotalPagesCreatedCommunity] = useState(1);
  const [filteredJoinedCommunity,setFilteredJoinedCommunity] = useState([]);
  const [currentPageJoinedCommunity,setCurrentPageJoinedCommunity] = useState(1);
  const [totalPagesJoinedCommunity,setTotalPagesJoinedCommunity] = useState(1);
  let joinedCommunitiesPerPage = 9;
  let createdCommunitiesPerPage = 9;

  useEffect( () =>
  {
    dispatch( fetchUserData() );

  }, [ dispatch ] );

  const fetchCreatedCommunities = (
    // console.log( "temp: ", temp ),
    async () =>
    {
      try
      {
        const response = await fetch( `${ process.env.NEXT_PUBLIC_SERVER_URL }/community/getByIds`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify( { communityIds: temp } ),
        } );
        const data = await response.json();
        // console.log("created community: ", data.communities);
        setCreatedCommunity( data.communities );
        setTotalPagesCreatedCommunity(Math.ceil(data.communities.length/createdCommunitiesPerPage));

        // console.log("total pages: ",totalPagesCreatedCommunity);
        setFilteredCreatedCommunity(data.communities.slice(0,createdCommunitiesPerPage));

      } catch ( error )
      {
        console.log( error );
      }
    }
  );

  const handleCreatedCommunityPagination = (page:number) => {
    setCurrentPageCreatedCommunity(page);
    let start = (page-1)*createdCommunitiesPerPage;
    let end = start + createdCommunitiesPerPage;
    setFilteredCreatedCommunity(createdCommunity.slice(start,end));
  }

  const handleJoinedCommunityPagination = (page:number) => {
    setCurrentPageJoinedCommunity(page);
  }

  const handleJoinMore = () =>
  {
    router.push( '/allcommunity' );
  };

  useEffect( () =>
  {
    if ( userCommunityIds && userCommunityIds.length > 0 )
    {
      dispatch( fetchCommunitiesByIds( userCommunityIds ) );
    }
    fetchCreatedCommunities();
    // console.log("created community: ", createdCommunity);
    // console.log("filtered created community: ", filteredCreatedCommunity);

  }, [] );

  useEffect(() => {
    // Set total pages based on the data length and items per page
    setTotalPagesJoinedCommunity(Math.ceil(userCommunities.length/joinedCommunitiesPerPage));

    // Slice the data to show only the items for the current page
    const startIndex = (currentPageJoinedCommunity - 1) * joinedCommunitiesPerPage;
    const endIndex = startIndex + joinedCommunitiesPerPage;
    setFilteredJoinedCommunity(userCommunities.slice(startIndex, endIndex));
  }, [userCommunities, currentPageJoinedCommunity, joinedCommunitiesPerPage]);

  return (
    <div className="bg-black w-[95%] mx-auto text-white min-h-screen">
      <div className="container px-2">
        <header className="mb-12 px-4 mt-4">
          <h1 className="text-xl sm:text-3xl font-bold mb-2 sm:mb-4">My Communities</h1>
          <div className="text-start text-gray-400">
              Here you can see the communities you have joined and created so far. You can also join more communities by clicking the button below.
          </div>
        </header>

        <section className="mb-16">
          <div className="flex justify-start sm:justify-between items-center px-4 mb-4">
            <h2 className="text-md font-bold text-center">
              Joined Communities
            </h2>
            { userCommunities.length > 0 &&
              <button
                onClick={ handleJoinMore }
                className="bg-famViolate hover:bg-[#7c5bff] text-white text-xs sm:text-sm font-bold py-2 px-4 rounded-full flex justify-center items-center"
              >
                <span><FaPlus className="mr-2" /></span> <span>Join More</span>
              </button> }
          </div>

          { ( filteredJoinedCommunity && filteredJoinedCommunity.length > 0 ) ?
            <>
            <div className="px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">

              { filteredJoinedCommunity.map( ( card: CommunityCardType, index ) => (

               <CommunityCard key={index} data={card}  />
              ) ) }
            </div>
            <div className="flex justify-center items-center" >
             <Pagination 
            showControls 
            onChange={(page)=>handleJoinedCommunityPagination(page)}
            total={totalPagesJoinedCommunity} 
            page={currentPageJoinedCommunity}
            initialPage={1} 
             classNames={{
              cursor:'bg-[#5538CE]',
             }}
             />
            </div>
          
            </>
            :
            <div className="col-span-full flex justify-center items-center py-12">
              <div className="bg-white/5 border border-[#282828] rounded-lg p-8 text-center max-w-md">
                <div className="mb-6">
                  <svg
                    className="mx-auto h-16 w-16 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-white mb-2">No Communities Found</h3>
                <p className="text-gray-400 mb-6">
                  We couldn't find any communities that you ever joined.
                </p>
                <button
                  onClick={ handleJoinMore }
                  className="px-4 py-2 bg-[#8c71ff] text-white font-semibold rounded-md hover:bg-[#7c5df9] transition duration-300 ease-in-out"
                >
                  Join Community
                </button>
              </div>
            </div>
          }
        </section>

        <section>
          <div className="flex justify-start sm:justify-between items-center mb-4 px-4">
            <h2 className="text-md font-bold ">
              Created Communities
            </h2>
            { ( createdCommunity && createdCommunity.length > 0 ) &&
              <button
                onClick={ () => router.push( '/kol/create-community' ) }
                className="bg-[#5538CE] hover:bg-[#7c5bff] text-white text-sm font-bold py-2 px-4 rounded-full flex justify-center items-center"
              >
                <span><FaPlus className="mr-2"/></span><span>Create</span>
              </button> }
          </div>

          { ( filteredCreatedCommunity && filteredCreatedCommunity.length > 0 ) ?(
            <>
            <div className="px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">

              { filteredCreatedCommunity?.map( ( card:CommunityCardType, index ) => (
                   <CommunityCard key={index} data={card} type="kol" />
              ) ) }
            </div>
            <div className="w-full flex justify-center items-center" >
            <Pagination 
            showControls 
            onChange={(page)=>handleCreatedCommunityPagination(page)}
            total={totalPagesCreatedCommunity} 
            page={currentPageCreatedCommunity}
            initialPage={1} 
             classNames={{
              cursor:'bg-[#5538CE]',
             }}
             />
            </div>
             
             </>)
            :
            <div className="col-span-full flex justify-center items-center py-12">
              <div className="bg-white/5 border border-[#282828] rounded-lg p-8 text-center max-w-md">
                <div className="mb-6">
                  <svg
                    className="mx-auto h-16 w-16 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-white mb-2">No Communities Found</h3>
                <p className="text-gray-400 mb-6">
                  We couldn't find any communities that you ever created.
                </p>
                <button
                  onClick={ () =>
                  {
                    router.push( '/kol/create-community' );
                  } }
                  className="px-4 py-2 bg-[#8c71ff] text-white font-semibold rounded-md hover:bg-[#7c5df9] transition duration-300 ease-in-out"
                >
                  Create your own communities
                </button>
              </div>
            </div> }
        </section>
      </div>
    </div>
  );
};

export default MyCommunities;
