"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

// Define the type for community
interface Community {
  _id: string;
  title: string;
  description: string;
  count_of_members: number;
  category: string[];
  ecosystem: string[];
}

const Page = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 10;

  const getCommunity = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/community/`,
        {
          params: {
            page: currentPage,
            limit: limit,
          },
        }
      );
      setCommunities(response.data.communities);
      setTotalPages(response.data.totalPages);
      // console.log("Community items :-", response.data);
    } catch (error) {
      console.log("error in getting community :-", error);
    }
  };

  useEffect(() => {
    getCommunity();
  }, [currentPage]);

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="p-4 mx-auto w-full md:w-[80%]">
        <div className="overflow-x-auto">
          <table className="w-full bg-white text-black rounded-lg mt-4">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="p-4 border-r text-center">S.No</th>
                <th className="p-4 border-r text-center">Title</th>
                <th className="p-4 border-r text-center">Category</th>
                <th className="p-4 border-r text-center">Description</th>
                <th className="p-4 border-r text-center">Ecosystem</th>
                <th className="p-4 border-r text-center">Members</th>
              </tr>
            </thead>
            <tbody>
              {communities.map((community, index) => (
                <tr
                  key={community._id}
                  className={`${index !== communities.length - 1 ? "border-b" : ""}`}
                >
                  <td className="p-2 border-r text-center">
                    {(currentPage - 1) * limit + index + 1}
                  </td>
                  <td className="p-2 border-r">{community.title}</td>
                  <td className="p-2 border-r">{community.category.join(", ")}</td>
                  <td className="p-2 border-r">{community.description}</td>
                  <td className="p-2 border-r">{community.ecosystem.join(", ")}</td>
                  <td className="p-2 border-r">{community.count_of_members}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center items-center gap-4 mt-5">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className={`border hover:shadow-md bg-slate-600 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded-full ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Prev
          </button>
          <span className="text-black">{currentPage}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className={`border hover:shadow-md bg-slate-600 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded-full ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
