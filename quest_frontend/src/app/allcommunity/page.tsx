"use client";
import React, { useEffect, useState } from "react";
import { FaUser, FaTwitter, FaBolt } from "react-icons/fa";
import
{
  fetchAllCommunities,
  joinCommunity,
} from "@/redux/reducer/communitySlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "@/redux/reducer/authSlice";
import
{
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Pagination,
} from "@nextui-org/react";
import axios from "axios";
import ReferralForm from "@/app/components/referalPopUp";
import { notify } from "@/utils/notify";
import { getCommunitySuccess } from "@/redux/reducer/adminCommunitySlice";

const MyCommunities = () =>
{
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  // const cardData:any = useSelector( ( state: RootState ) => state.community.allCommunities );
  const memberId = useSelector( ( state: RootState ) => state.login.user?._id );
  const [ loadingCommunityId, setLoadingCommunityId ] = useState<string | null>(
    null
  );
  const [ search, setSearch ] = useState<string>( "" );
  const [ ecosystem, setEcosystem ] = useState<string>( "" );
  const [ category, setCategory ] = useState<string>( "" );
  const [ communities, setCommunities ] = useState<any[]>( [] );
  const [ selectedEcosystem, setSelectedEcosystem ] = useState<string[]>( [] );
  const [ selectedCategories, setSelectedCategories ] = useState<string[]>( [] );
  const [ page, setPage ] = useState( 1 );
  const [ totalPages, setTotalPages ] = useState( 1 );
  const [ itemsPerPage, setItemsPerPage ] = useState<Number>(12);


  // const data = useSelector( ( state: RootState ) => state.community.forall );
  const data = useSelector( ( state: any ) => state.adminCommunity );

  const categories = data?.categories || [];
  const ecosystems = data?.ecosystems || [];

  let storedCategory;
  useEffect( () =>
  {
    storedCategory = localStorage?.getItem( 'category' );
    if ( storedCategory )
    {
      setSelectedCategories( [ storedCategory ] );
      // optionally, remove it from session storage if you don't need it anymore
      localStorage.removeItem( 'category' );
    }

    // console.log("category Name:",storedCategory)
  }, [] );


  // console.log( selectedCategories );

  const joinningCommunity = async ( e: any ) =>
  {
    setLoadingCommunityId( e._id );
    try
    {
      const res = await dispatch(
        joinCommunity( { memberId, id: e._id } )
      ).unwrap();
      // console.log( res );
      await dispatch( fetchAllCommunities() );
    } catch ( error )
    {
      console.log( "error in adding the community", "123", error );
    } finally
    {
      // console.log( "Tis is finally" );
      fetchCommunities( search, ecosystem, category, page );
      setLoadingCommunityId( null );
    }
  };

  const fetchCommunities = async (
    search: string,
    ecosystem: string,
    category: string,
    currentPage: number
  ) =>
  {
    try
    {
      const response = await axios.post(
        `${ process.env.NEXT_PUBLIC_SERVER_URL }/community/get`,
        {
          search,
          ecosystem: selectedEcosystem,
          category: selectedCategories,
        },
        {
          params: {
            page: currentPage,
            limit: itemsPerPage,
          }
        }
      );

      setCommunities( response.data.communities );
      setTotalPages( response.data.pagination.totalPages );
      // You might want to update other pagination info as well
    } catch ( error )
    {
      console.error( "Failed to fetch communities:", error );
    }
  };
  // console.log( "communities:-", communities );

  useEffect( () =>
  {
    fetchCommunities( "", "", "", page );
    dispatch( getCommunitySuccess() );

    // dispatch( fetchAllCommunities() );
    // dispatch( fetchCategoryEcosystem() );
    dispatch( fetchUserData() );
  }, [ page, itemsPerPage ] );

  const handlePageChange = ( newPage: any ) =>
  {
    setPage( newPage );
  };

  const handleSubmit = async ( e: React.FormEvent<HTMLFormElement> ) =>
  {
    e.preventDefault();
    fetchCommunities( search, ecosystem, category, page );
  };

  const rest = async () =>
  {
    setSearch( '' );
    setSelectedCategories( [] );
    setSelectedEcosystem( [] );
    fetchCommunities( "", "", "", page );

  };
  return (
    <div className="bg-black text-white min-h-screen">
      <div className="mx-4 lg:mx-20 sm:ml-20">
        <div className="text-2xl pt-10 font-bold text-center lg:text-start ">
          <h1>All Communities</h1>
        </div>
        <div className="max-w-[600px] pt-4 text-gray-400">
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolore
            neque magni dolorum dignissimos enim delectus velit ut aspernatur.
          </p>
        </div>

        <div className="mb-4">
          <form onSubmit={ handleSubmit }>
            <div className="flex flex-col lg:flex-row lg:justify-between justify-center gap-2 lg:gap-0 p-4">
              <div className="relative md:block">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                  <span className="sr-only">Search icon</span>
                </div>
                <input
                  type="text"
                  id="search-navbar"
                  className="block w-full p-2 ps-10  text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-cyan-500 dark:focus:border-cyan-500"
                  placeholder="Search..."
                  value={ search }
                  onChange={ ( e ) => setSearch( e.target.value ) }
                />
              </div>
              <div className="flex flex-col items-center justify-center gap-2 lg:flex-row">
                <div className="grid grid-cols-2 ">
                  <div className="text-white lg:bg-slate-800 sm:bg-slate-800  rounded-xl mx-4 ">
                    <Dropdown className="bg-slate-800">
                      <DropdownTrigger>
                        <Button
                          variant="bordered"
                          className="capitalize text-white"
                        >
                          { selectedCategories.length > 0
                            ? selectedCategories.join( ", " )
                            : "Select Categories" }
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Select Categories"
                        disallowEmptySelection
                        selectionMode="multiple"
                        selectedKeys={ selectedCategories }
                        onSelectionChange={ ( keys ) =>
                          setSelectedCategories( Array.from( keys ) as string[] )
                        }
                      >
                        { categories.map( ( cat: any ) => (
                          <DropdownItem key={ cat.name }>{ cat.name }</DropdownItem>
                        ) ) }
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                  <div className="text-black lg:bg-slate-800 sm:bg-slate-800  rounded-xl mx-4 ">
                    <Dropdown className="bg-slate-800">
                      <DropdownTrigger>
                        <Button
                          variant="bordered"
                          className="capitalize text-white"
                        >
                          { selectedEcosystem.length > 0
                            ? selectedEcosystem.join( ", " )
                            : "Select Ecosystem" }
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Select Ecosystem"
                        disallowEmptySelection
                        selectionMode="multiple"
                        onSelectionChange={ ( keys ) =>
                          setSelectedEcosystem( Array.from( keys ) as string[] )
                        }
                        selectedKeys={ selectedEcosystem }
                      >
                        { ecosystems.map( ( eco: any ) => (
                          <DropdownItem key={ eco.name }>{ eco.name }</DropdownItem>
                        ) ) }
                      </DropdownMenu>
                    </Dropdown>
                  </div>

                </div>
                <div className="flex justify-center items-center gap-4">
                  <button
                    type="submit"
                    className="px-6 py-2 border-2 border-blue-500 text-blue-500 font-semibold rounded-xl transition duration-300 ease-in-out hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    Apply
                  </button>
                  <button
                    onClick={ rest }
                    className="px-6 py-2 border-2 border-red-500 text-red-500 font-semibold rounded-xl transition duration-300 ease-in-out hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
        
          <div className="flex justify-end items-center my-2">
              <div className="flex items-center justify-end border-white border-1 rounded-xl gap-2 bg-slate-900 p-2 text-white">
              <label htmlFor="itemPerPage" className="text-sm font-medium ">Items Per Page</label>
              <select className="text-white bg-slate-900" name="itemPerPage" id="itemPerPage" value={itemsPerPage.toString()} onChange={(e) => setItemsPerPage(parseInt(e.target.value))}>
              <option value="12">12</option>
              <option value="24">24</option>
              <option value="36">36</option>
              </select>
            </div>
            </div>
        { ( communities && communities.length ) ?
          <>
            <div className="grid gap-4 sm:gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 pt-8 ">
              { communities?.map( ( card: any, index: number ) => (
                <div
                  key={ index }
                  onClick={ () =>
                  {
                    if ( memberId && card.creator == memberId )
                    {
                      router.push( `/kol/community-project/${ card._id }` );
                    } else if ( memberId && card.members.includes( memberId ) )
                    {
                      router.push( `/user/community-project/${ card._id }` );
                    } else
                    {
                      router.push( `/allcommunity/${ card._id }` );
                    }
                  } }
                  className=" bg-white/5 cursor-pointer outer-div relative flex lg:gap-2 sm:gap-4 gap-4  hover:bg-[#8c71ff] hover:text-[#111111] border-[#282828] border rounded-md lg:p-4 sm:p-2 p-4 flex-col justify-center w-full sm:w-full"
                >
                  <div className="flex  flex-row md:flex-row lg:flex-row text-xl items-center justify-around ">
                    <div className="p-1">
                      <div className="image-container h-[4rem] w-[4rem] md:h-[5rem] md:w-[5rem] items-center flex ">
                        <img
                          src={ card.logo }
                          alt="style image"
                          className="styled-image"
                        />
                      </div>
                      <div className="bg_Div_Down h-[1rem] md:h-[2rem] bg-gray-800">
                        { " " }
                      </div>
                    </div>

                    <div className="md:w-2/3 w-2/3 flex flex-col justify-start gap-2 ">
                      <div className="flex w-full flex-col items-start ">
                        <div className="flex w-full md:h-[5rem] bg_eco_div border-b-4 border-[#8c71ff] gap-2 md:gap-2  p-2 bg-[#28223d] flex-col lg:flex-row items-center md:items-end lg:items-end justify-between ">
                          <div className="md:w-4/5  w-4/5 truncate text-[12px] md:text-[10px] lg:text-[10px] md:ml-3 md:text-start text-center card-title">
                            { card.title }
                          </div>

                          <div className="md:1/5 flex flex-row rounded-lg justify-center md:justify-end">
                            <div className="flex gap-1 mr-2 items-center flex-col">
                              <span className="card-white-text text text-lg ">
                                { card.quests.length }
                              </span>
                              <span className=" card-gray-text text-3xl">
                                QUESTS
                              </span>
                            </div>
                            <div className="flex gap-1 items-center flex-col">
                              <span className="card-white-text text-lg">
                                { card.members.length }
                              </span>
                              <span className=" card-gray-text text-lg">
                                FOLLOWERS
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex w-full flex-row justify-end gap-2">
                        <div className="flex bg-[#8C71FF] py-1 px-2 items-center">
                          <FaUser className="md:w-4 w-2 h-2 md:h-4" />
                          <div className="pl-1 text-sm">{ card.members.length }</div>
                        </div>
                        <div className="flex bg-[#8C71FF] py-1 px-2 items-center">
                          <FaBolt className="md:w-4 w-2 h-2 md:h-4" />
                          <div className="pl-1 text-sm">{ card.quests.length }</div>
                        </div>
                        <div className="flex bg-[#8C71FF] py-1 px-2 items-center">
                          <FaTwitter className="md:w-4 w-2 h-2 md:h-4" />
                          <div className="pl-1 text-sm"></div>
                        </div>
                        {/* <div className="eco_box w-5 h-5 bg-[#8c71ff]" />
              <div className="eco_box w-5 h-5 bg-[#8c71ff]" />
              <div className="eco_box w-5 h-5 bg-[#8c71ff]" /> */}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row text-xs m-1 gap-2 justify-start  ">
                    <span className=" descText">Bio: </span>
                    <span className="descdata text-wrap ">
                      { card.description.slice( 0, 20 ) }
                    </span>
                  </div>

                  { card.members.includes( memberId ) ? (
                    <div className="flex justify-center items-center mt-1" >
                      <button
                        className="px-2 py-1 text-sm bg-green-500/20 text-green-400 text-center font-medium rounded-lg transition-all duration-300 ease-in-out cursor-default border border-green-500/50 hover:bg-green-500/30 w-full"
                        disabled
                      >
                        Joined
                      </button>
                    </div>
                  ) : memberId && card.creator === memberId ? (
                    <div className="flex gap-3 mt-1">
                      <button
                        className="px-2 py-1 text-xs bg-white/10 hover:bg-white/25 text-center text-neutral-400 descdata rounded-md transition-all duration-300 ease-in-out cursor-pointer hover:shadow-lg"
                        onClick={ () => router.push( `/kol/community-project/${ card._id }` ) }
                      >
                        View Your Community
                      </button>
                    </div>
                  ) : memberId ? (
                    <div className="flex gap-3 mt-1" >
                      <button
                        className={ `px-2 py-1 text-xs bg-white/10 hover:bg-white/25 text-center text-neutral-400 descdata hover:text-black rounded-md transition-all duration-300 ease-in-out cursor-pointer hover:shadow-lg ${ loadingCommunityId === card._id ? "cursor-wait" : ""
                          }` }
                        onClick={ ( e ) =>
                        {
                          e.stopPropagation();
                          if ( loadingCommunityId === null ) joinningCommunity( card );
                        } }
                        disabled={ loadingCommunityId !== null }
                      >
                        { loadingCommunityId === card._id ? "Joining..." : "Join Community" }
                      </button>
                      <ReferralForm memberId={ memberId } id={ card._id } />
                    </div>
                  ) : (
                    <div className="mt-1 w-full" >
                      <button
                        className="px-2 py-1 text-xs bg-white/10 hover:bg-white/25 text-center text-neutral-400 descdata hover:text-black rounded-md transition-all duration-300 ease-in-out cursor-pointer hover:shadow-lg w-full"
                        onClick={ () => router.push( '/login' ) }
                      >
                        Please Login
                      </button>
                    </div>
                  ) }
                </div>
              ) ) }
            </div>

            <div className="flex justify-center items-center my-16">
              <Pagination
                onChange={ handlePageChange } page={ page }initialPage={ 1 } total={ totalPages } isCompact showControls
               
              />
              </div>
            
           
          </>
          : <div className="col-span-full flex justify-center items-center py-12">
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
                We couldn't find any communities matching your criteria. Try adjusting your filters or search terms.
              </p>
              <button
                onClick={ rest }
                className="px-4 py-2 bg-[#8c71ff] text-white font-semibold rounded-md hover:bg-[#7c5df9] transition duration-300 ease-in-out"
              >
                Reset Filters
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export default MyCommunities;
