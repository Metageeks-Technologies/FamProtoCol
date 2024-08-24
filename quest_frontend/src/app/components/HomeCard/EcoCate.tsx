import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

interface data
{
  id: number;
  imageUrl: string;
  name: string;
}

const EcoCate: React.FC = () =>
{
  const router = useRouter();

  //  const ecosystem = useSelector( ( state: any ) => state.community.ecosystemCommunities )

  const communityData = useSelector( ( state: any ) => state.adminCommunity );
  const ecosystem = communityData.ecosystems.slice( 0, 7 );
  const categories = communityData.categories.slice( 0, 5 );

  // console.log( "ecosystem :-0", communityData );
  return (
    <div className="lg:mt-10 md:mt-4 mt-4 ">
      <div className="flex items-center gap-1 mt-8 lg:mx-0 sm:mx-6 mx-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="11"
          viewBox="0 0 16 11"
          fill="none"
        >
          <path
            d="M1 1H6.48652L15 10"
            stroke="#FA00FF"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M6 5L11 10" stroke="#FA00FF" strokeLinecap="round" />
        </svg>
        <div>
          <p>Ecosystems</p>
        </div>
      </div>
      <div className="eco&cat flex flex-col lg:flex-row lg:justify-between gap-10 ">
        <div className="Main grid gap-4 mx-8  lg:mx-0 grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 pt-6 lg:basis-[50%]">
          { ecosystem?.map( ( item: data ) => (
            <div key={ item.id } className="card p cursor-pointer flex gap-1" onClick={ () => router.push( `/ecosystem/${ item.name }` ) }>
              <div className="card bg-black w-28 h-28 border border-gray-700 flex items-center justify-center relative">
                <div className="w-full h-full relative">
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-10"
                    style={ { backgroundImage: `url( ${ item.imageUrl } )` } }
                  ></div>
                  <div className="relative flex items-center justify-center w-full h-full">
                    <img
                      src={ item.imageUrl }
                      alt="Profile"
                      className="w-16 h-16 object-cover rounded-full"
                    />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="5"
                    height="5"
                    viewBox="0 0 4 4"
                    fill="none"
                  >
                    <path d="M4 0.5L0.5 0.5L0.5 4" stroke="white" />
                  </svg>
                </div>
              </div>

              <div className="icon flex flex-col justify-start gap-2 bg-white/10 h-24 w-8 icon-clip">
                { [ "⭐", "🍎", "⬆" ].map( ( icon, index ) => (
                  <span key={ index } className="text">
                    { icon }
                  </span>
                ) ) }
              </div>
            </div>
          ) ) }
          <div className="flex items-center cursor-pointer ml-4  " onClick={ () => router.push( '/ecosystem' ) } >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="29"
              height="31"
              viewBox="0 0 29 31"
              fill="none"
            >
              <path
                opacity="0.8"
                d="M25 0.5H4C1.79086 0.5 0 2.29086 0 4.5V26.875C0 28.877 1.62297 30.5 3.625 30.5H4.59167H24.4083H25.375C27.377 30.5 29 28.877 29 26.875V4.5C29 2.29086 27.2091 0.5 25 0.5Z"
                fill="#5538CE"
              />
              <path
                d="M5.55329 26.5377L4 26.5377C1.79086 26.5377 -2.51477e-07 24.7469 -3.48042e-07 22.5377L-1.1365e-06 4.5C-1.23306e-06 2.29086 1.79086 0.500002 4 0.500002L25 0.500001C27.2091 0.500001 29 2.29086 29 4.5L29 22.5377C29 24.7469 27.2091 26.5377 25 26.5377L23.4467 26.5377C22.3623 26.5377 21.3244 26.978 20.5708 27.7576L19.0991 29.2801C18.3454 30.0597 17.3075 30.5 16.2231 30.5L12.7769 30.5C11.6925 30.5 10.6546 30.0597 9.90094 29.2801L8.42925 27.7576C7.67558 26.978 6.63767 26.5377 5.55329 26.5377Z"
                fill="#5538CE"
              />
              <path
                d="M18 15.0862V15.9138H14.9214V19H14.0786V15.9138H11V15.0862H14.0786V12H14.9214V15.0862H18Z"
                fill="white"
              />
            </svg>
          </div>
        </div>

        {/* pending */ }
        <div>
          <div className="relative sm:mx-10 lg:mx-0 mx-10 ">
            <div className="flex items-center gap-1 pt-1  absolute bottom-6 left-0 lg:mt-0 sm:pt-10 ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="11"
                viewBox="0 0 16 11"
                fill="none"
              >
                <path
                  d="M1 1H6.48652L15 10"
                  stroke="white"
                  strokeOpacity="0.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 5L11 10"
                  stroke="white"
                  strokeOpacity="0.3"
                  strokeLinecap="round"
                />
              </svg>
              <div>
                <h1 className="font-thin text-gray-400 ">Categories</h1>
              </div>
            </div>
            <div className="relative  items-center ">
              <div className="absolute bottom-0 ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="6"
                  height="6"
                  viewBox="0 0 4 5"
                  fill="none"
                >
                  <path d="M0 4L3.5 4L3.5 0.5" stroke="#FA00FF" />
                </svg>
              </div>

              <div className="absolute top-0 left-40 ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="6"
                  height="6"
                  viewBox="0 0 5 4"
                  fill="none"
                >
                  <path d="M4.5 3.5L1 3.5L1 4.17371e-08" stroke="#FA00FF" />
                </svg>
              </div>

              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="160"
                  height="59"
                  viewBox="0 0 160 59"
                  fill="none"
                >
                  <path
                    d="M159 0.5L114 45.5H23L10.5 58H0"
                    stroke="white"
                    strokeOpacity="0.4"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="  grid items-center  lg:grid-cols-5 sm:grid-cols-5 sm:mx-10 lg:gap-8 grid-cols-2  mt-16  shadow-2xl rounded-md mx-10 lg:mx-auto  basis-[50%]">
            { categories.map( ( card: data, index: number ) => (
              <div
                key={ index }
                className="cate flex items-center mb-4 lg:mb-0 hover:cursor-pointer"
                onClick={ () =>
                {
                  // Store the category name in session storage
                  localStorage.setItem( 'category', card.name );
                  router.push( '/allcommunity' );
                }
                }

              >

                <div className="text-center">
                  <div className="image-container h-[6rem] w-[6rem]">
                    <img
                      src={ card.imageUrl }
                      alt={ card.name }
                      className="styled-image"
                    />
                  </div>

                  <h1
                    className=" mt-1 text-center"
                    style={ { letterSpacing: "2px" } }
                  >
                    { card.name }
                  </h1>
                </div>
              </div>
            ) ) }
          </div>
        </div>
      </div>

      <div></div>
    </div>
  );
};

export default EcoCate;