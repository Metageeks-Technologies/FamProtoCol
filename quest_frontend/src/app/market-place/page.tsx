import React from 'react';
import Image from 'next/image';

interface ProfileProps
{
    name: string;
    quests: number;
    followers: number;
    bio: string;
    imageUrl: string;
}



const Profile: React.FC<ProfileProps> = ( { name, quests, followers, bio, imageUrl } ) =>
{

    return (
        <div className='group flex flex-col sm:flex-row border-[#333333] border p-4 w-full max-w-md bg-[#111111] text-white m-auto my-5 rounded-lg shadow-xl hover:bg-[#8c71ff] hover:text-[#000000]'>
            <div className='w-full sm:w-1/3 flex flex-col items-center mb-4 sm:mb-0 justify-between '>
                <div className='h_image-container  w-28 h-28 overflow-hidden rounded-lg'>
                    <img src={imageUrl} alt={name} width={100} height={ 100 } className='h_styled-image object-cover' />
                </div>
                <div className='h_bg_Div_Down bg-gray-800 group-hover:bg-[#735dcf] ' />
                <div>

                    <div className="flex justify-center space-x-2 sm:space-x-2 sm:mt-4 group-hover:bg-[#735dcf]">
                        <div className="h_icon_container w-8 h-8 sm:w-10 sm:h-10">
                            <button className="h_icon w-full h-full bg-[#111111] group-hover:bg-[#735dcf] flex items-center justify-center">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                </svg>
                            </button>
                        </div>
                        <div className="h_icon_container_2 w-8 h-8 sm:w-10 sm:h-10">
                            <button className="h_icon w-full h-full bg-[#111111] group-hover:bg-[#735dcf] flex items-center justify-center">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19.54 0c1.356 0 2.46 1.104 2.46 2.472v21.528l-2.58-2.28-1.452-1.344-1.536-1.428.636 2.22h-13.608c-1.356 0-2.46-1.104-2.46-2.472v-16.224c0-1.368 1.104-2.472 2.46-2.472h16.08zm-4.632 15.672c2.652-.084 3.672-1.824 3.672-1.824 0-3.864-1.728-6.996-1.728-6.996-1.728-1.296-3.372-1.26-3.372-1.26l-.168.192c2.04.624 2.988 1.524 2.988 1.524-1.248-.684-2.472-1.02-3.612-1.152-.864-.096-1.692-.072-2.424.024l-.204.024c-.42.036-1.44.192-2.724.756-.444.204-.708.348-.708.348s.996-.948 3.156-1.572l-.12-.144s-1.644-.036-3.372 1.26c0 0-1.728 3.132-1.728 6.996 0 0 1.008 1.74 3.66 1.824 0 0 .444-.54.804-.996-1.524-.456-2.1-1.416-2.1-1.416l.336.204.048.036.047.027.014.006.047.027c.3.168.6.3.876.408.492.192 1.08.384 1.764.516.9.168 1.956.228 3.108.012.564-.096 1.14-.264 1.74-.516.42-.156.888-.384 1.38-.708 0 0-.6.984-2.172 1.428.36.456.792.972.792.972zm-5.58-5.604c-.684 0-1.224.6-1.224 1.332 0 .732.552 1.332 1.224 1.332.684 0 1.224-.6 1.224-1.332.012-.732-.54-1.332-1.224-1.332zm4.38 0c-.684 0-1.224.6-1.224 1.332 0 .732.552 1.332 1.224 1.332.684 0 1.224-.6 1.224-1.332 0-.732-.54-1.332-1.224-1.332z" />
                                </svg>
                            </button>
                        </div>
                        <div className="h_icon_container_3 w-8 h-8 sm:w-10 sm:h-10">
                            <button className="h_icon w-full h-full bg-[#111111] group-hover:bg-[#735dcf] flex items-center justify-center">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className='w-full sm:w-2/3 flex flex-col sm:pl-4'>
                <div className='flex justify-evenly sm:justify-end mb-4'>
                    <h2 className='text-sm font-bold mb-2 text-start mr-7 mt-3 sm:text-left'>{ name }</h2>
                    <div className='text-center sm:text-right mr-3'>
                        <span className='block '>{ quests }</span>
                        <span className='opacity-40' >QUESTS</span>
                    </div>
                    <div className='text-start sm:text-right'>
                        <span className='block'>{ followers }</span>
                        <span className='opacity-40 text-sm'>FOLLOWERS</span>
                    </div>
                </div>
                <p className='text-xs p-2 mb-4 text-center sm:text-left group-hover:bg-[#735dcf]'>
                    <span >BIO: </span>
                    <span className='opacity-40 font-semibold justify-center'>
                        { bio }
                    </span>
                </p>
                <div className="mb-4">
                    <span className="text-xs text-gray-400 group-hover:text-black">VOTES</span>
                    <div className="mt-1 flex space-x-1">
                        { [ ...Array( 6 ) ].map( ( _, i ) => (
                            <div key={ i } className={ `h-1 w-full ${ i < 3 ? 'bg-purple-500' : 'bg-gray-700' }` }></div>
                        ) ) }
                    </div>
                </div>
            </div>
        </div>
    );
};


const MarketPlace: React.FC = () =>
{

    const profiles: ProfileProps[] =
        [
            {
                name: "Alpha Hub",
                quests: 214,
                followers: 7701,
                bio: "Lorem ipsum, dolor sit amet consectetur adipisicing elitorem ipsum, dolor sit amet consectetur.",
                imageUrl: "https://plus.unsplash.com/premium_photo-1675716926653-8f4529595012?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            },
            {
                name: "Alpha Hub",
                quests: 214,
                followers: 7701,
                bio: "Lorem ipsum, dolor sit amet consectetur adipisicing elitorem ipsum, dolor sit amet consectetur.",
                imageUrl: "https://plus.unsplash.com/premium_photo-1675716926653-8f4529595012?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }, {
                name: "Alpha Hub",
                quests: 214,
                followers: 7701,
                bio: "Lorem ipsum, dolor sit amet consectetur adipisicing elitorem ipsum, dolor sit amet consectetur.",
                imageUrl: "https://plus.unsplash.com/premium_photo-1675716926653-8f4529595012?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }, {
                name: "Alpha Hub",
                quests: 214,
                followers: 7701,
                bio: "Lorem ipsum, dolor sit amet consectetur adipisicing elitorem ipsum, dolor sit amet consectetur.",
                imageUrl: "https://plus.unsplash.com/premium_photo-1675716926653-8f4529595012?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }, {
                name: "Alpha Hub",
                quests: 214,
                followers: 7701,
                bio: "Lorem ipsum, dolor sit amet consectetur adipisicing elitorem ipsum, dolor sit amet consectetur.",
                imageUrl: "https://plus.unsplash.com/premium_photo-1675716926653-8f4529595012?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }, {
                name: "Alpha Hub",
                quests: 214,
                followers: 7701,
                bio: "Lorem ipsum, dolor sit amet consectetur adipisicing elitorem ipsum, dolor sit amet consectetur.",
                imageUrl: "https://plus.unsplash.com/premium_photo-1675716926653-8f4529595012?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }, {
                name: "Alpha Hub",
                quests: 214,
                followers: 7701,
                bio: "Lorem ipsum, dolor sit amet consectetur adipisicing elitorem ipsum, dolor sit amet consectetur.",
                imageUrl: "https://plus.unsplash.com/premium_photo-1675716926653-8f4529595012?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }, {
                name: "Alpha Hub",
                quests: 214,
                followers: 7701,
                bio: "Lorem ipsum, dolor sit amet consectetur adipisicing elitorem ipsum, dolor sit amet consectetur.",
                imageUrl: "https://plus.unsplash.com/premium_photo-1675716926653-8f4529595012?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }, {
                name: "Alpha Hub",
                quests: 214,
                followers: 7701,
                bio: "Lorem ipsum, dolor sit amet consectetur adipisicing elitorem ipsum, dolor sit amet consectetur.",
                imageUrl: "https://plus.unsplash.com/premium_photo-1675716926653-8f4529595012?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }, {
                name: "Alpha Hub",
                quests: 214,
                followers: 7701,
                bio: "Lorem ipsum, dolor sit amet consectetur adipisicing elitorem ipsum, dolor sit amet consectetur.",
                imageUrl: "https://plus.unsplash.com/premium_photo-1675716926653-8f4529595012?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }, {
                name: "Alpha Hub",
                quests: 214,
                followers: 7701,
                bio: "Lorem ipsum, dolor sit amet consectetur adipisicing elitorem ipsum, dolor sit amet consectetur.",
                imageUrl: "https://plus.unsplash.com/premium_photo-1675716926653-8f4529595012?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }, {
                name: "Alpha Hub",
                quests: 214,
                followers: 7701,
                bio: "Lorem ipsum, dolor sit amet consectetur adipisicing elitorem ipsum, dolor sit amet consectetur.",
                imageUrl: "https://plus.unsplash.com/premium_photo-1675716926653-8f4529595012?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }, {
                name: "Alpha Hub",
                quests: 214,
                followers: 7701,
                bio: "Lorem ipsum, dolor sit amet consectetur adipisicing elitorem ipsum, dolor sit amet consectetur.",
                imageUrl: "https://plus.unsplash.com/premium_photo-1675716926653-8f4529595012?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }, {
                name: "Alpha Hub",
                quests: 214,
                followers: 7701,
                bio: "Lorem ipsum, dolor sit amet consectetur adipisicing elitorem ipsum, dolor sit amet consectetur.",
                imageUrl: "https://plus.unsplash.com/premium_photo-1675716926653-8f4529595012?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }, {
                name: "Alpha Hub",
                quests: 214,
                followers: 7701,
                bio: "Lorem ipsum, dolor sit amet consectetur adipisicing elitorem ipsum, dolor sit amet consectetur.",
                imageUrl: "https://plus.unsplash.com/premium_photo-1675716926653-8f4529595012?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            },
        ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
            { profiles.map( ( profile, index ) => (
                <Profile key={ index } { ...profile } />
            ) ) }
        </div>

    );
};

export default MarketPlace;

