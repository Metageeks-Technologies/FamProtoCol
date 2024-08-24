'use client';
import Image from 'next/image';
import React from 'react';

const Community: React.FC = () =>
{
    return (
        <div className="max-w-2xl mx-auto p-4 py-20 h-full pt-52">
            <h1 className="text-4xl font-bold text-center">Community Page</h1>
            <div className="bg-white rounded-lg shadow-lg">
                <div className="h-36 bg-gray-300 ">
                    <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOwRConBYl2t6L8QMOAQqa5FDmPB_bg7EnGA&s"
                        alt="Community Banner"
                        className="w-full h-full object-cover "
                    />
                </div>

                <div className="p-4">
                    <div className="flex items-start mb-4 ">
                        <div className="w-44 h-16 rounded-full mr-4 flex-shrink-0">
                            <img
                                src="https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg"
                                alt="Logo"
                                className="w-24 h-24 object-cover rounded-full -mt-20 z-50  "
                            />

                            <div className="mt-3 flex -space-x-2">
                                <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                                <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                                <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80" alt="" />
                                <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                                <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                            </div>
                        </div>

                        <div className="flex-grow h-auto">
                            <div className="h-px bg-gray-300 w-full mb-2"></div>
                            <p className="text-sm text-gray-600">
                                This is a description of the community. It can span multiple lines and provide
                                important information about the community's purpose and goals.
                                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Illum nisi quae distinctio fugiat quod asperiores commodi voluptate.
                            </p>
                        </div>
                    </div>

                    <div className="flex p-5 border">

                        <div className="w-2/3 pr-4">
                            {/* on clicking the button land on /community page */ }
                            <button className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-
                            2 px-4 rounded focus:outline-none focus:shadow-outline"

                                onClick={ () => window.location.href = "/user/community-project" }
                            >
                                Go to Leader Board
                            </button>
                            <h3 className="font-bold mb-2">Setup Tasks:</h3>
                            <ul className="list-disc list-inside text-sm">
                                <li>Complete profile</li>
                                <li>Join discord channel</li>
                                <li>Invite 3 friends</li>
                                <li>Participate in first event</li>
                            </ul>
                        </div>
                        <div className="w-1/3">
                            <div className="bg-gray-100 p-3 rounded-lg">
                                <h3 className="font-bold mb-2">Sprint Timer</h3>
                                <div className="text-2xl font-bold text-center">
                                    00:45:30
                                </div>
                            </div>
                            <button className="mt-4 w-full bg-cyan-500 text-white py-2 px-4 rounded hover:bg-cyan-600 transition duration-300">
                                About Reward Pool
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Community;