import React from "react";

const CommunityCardSkeleton: React.FC = () =>
{
    return (
        <div className="animate-pulse">
            <div className="outer-div relative flex lg:gap-2 sm:gap-4 gap-4 border-[#282828] border rounded-md lg:p-5 sm:p-2 p-4 flex-col justify-center w-full sm:w-full">
                <div className="flex flex-row text-xl items-center justify-around">
                    <div className="p-1">
                        <div className="image-container md:h-[5rem] md:w-[5rem] h-[4rem] w-[4rem] items-center flex">
                            <div className="styled-image bg-gray-600 w-full h-full rounded-full" />
                        </div>
                        <div className="bg_Div_Down h-[2rem] mt-2 bg-gray-700" />
                    </div>

                    <div className="md:w-2/3 w-2/3 flex flex-col justify-start gap-2">
                        <div className="flex w-full flex-col items-start">
                            <div className="flex w-full md:h-[5rem] bg_eco_div border-b-4 border-gray-600 gap-2 md:gap-2 p-2 bg-gray-700 flex-col lg:flex-row items-center md:items-end lg:items-end justify-between">
                                <div className="md:w-4/5 w-4/5 h-4 bg-gray-600 rounded"></div>

                                <div className="md:1/5 flex flex-row rounded-lg justify-center md:justify-end">
                                    <div className="flex gap-1 mr-2 items-center flex-col">
                                        <div className="h-6 w-6 bg-gray-600 rounded"></div>
                                        <div className="h-4 w-16 bg-gray-600 rounded"></div>
                                    </div>
                                    <div className="flex gap-1 items-center flex-col">
                                        <div className="h-6 w-6 bg-gray-600 rounded"></div>
                                        <div className="h-4 w-16 bg-gray-600 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute -top-1 -right-1">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="6"
                        height="6"
                        viewBox="0 0 4 4"
                        fill="none"
                    >
                        <path d="M0.5 0V3.5H4" stroke="white" />
                    </svg>
                </div>

                <div>
                    <div className="flex flex-row text-xs m-1 gap-2 justify-start">
                        <div className="h-4 w-8 bg-gray-600 rounded"></div>
                        <div className="h-4 w-3/4 bg-gray-600 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunityCardSkeleton;