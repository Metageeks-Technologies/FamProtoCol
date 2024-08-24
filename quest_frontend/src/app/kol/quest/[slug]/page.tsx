"use client";
import { fetchQuestById } from "@/redux/reducer/questSlice";
import { completeTask, fetchTaskById } from "@/redux/reducer/taskSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { AnyAction } from 'redux';
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface Completion
{
  user: string;
  completedAt: string;
  submission: string;
  userName: string;
  _id: string;
}

interface CardData
{
  _id: string;
  image: string;
  name: string;
  description: string;
  type: string;
  category: string;
  visitLink?: string;
  question?: string;
  options?: string[];
  correctAnswer?: string;
  inviteLink?: string;
  uploadLink?: string;
  completions: Completion[];
}

const QuestPage = ( { params }: { params: { slug: string; }; } ) =>
{
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const questId: string | any = params.slug;
  const [ selectedCard, setSelectedCard ] = useState<CardData | null>( null );
  const tasks = useSelector( ( state: RootState ) => state.task.currentTask );
  // useSelector((state:any)=>console.log(state.task))
  // console.log(tasks)
  useEffect( () =>
  {
    dispatch( fetchTaskById( questId ) );
  }, [] );


  const handleCardClick = (card: CardData) => {
    setSelectedCard(card);
    
  };

  const handleClosePopup = () =>
  {
    setSelectedCard( null );
  };

  const addTask = () =>
  {
    router.push( `/kol/add-task/${ questId }` )
  };


  return (
    <div className="text-white min-h-screen">
      <div className="w-[80%] mx-auto py-10">
        <h1 className="text-2xl font-bold mb-4">Quest Monitoring</h1>
        {/* progress bar */}
         {/* <div className="my-5">
          <h1 className="text-2xl">Task progress Bar</h1>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-blue-700 dark:text-white">
              {progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-green-500 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div> */}
        { tasks && tasks?.length > 0 && (

          <div className="flex flex-col md:flex-row md:justify-between">
            <div className="max-w-[600px] pt-4 text-gray-400 flex justify-end">
              <p className="text-white mb-6">Monitor task completions and submissions.</p>
            </div>

            <div className="md:pt-6 md:inline-block">
              <button className="bg-gray-700 hover:bg-gray-900 text-white font-medium w-full md:w-auto px-5 py-2 rounded-3xl"
                onClick={ addTask }
              >
                Add task
              </button>
            </div>
          </div>
        ) }

        { ( tasks.length === 0 ) && (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <div className="text-center p-8 rounded-xl shadow-lg max-w-md w-full bg-slate-900">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
              <h3 className="text-xl font-medium text-white mb-2 ">No tasks available</h3>
              <p className="text-gray-400 mb-6">Get started by creating a new task for this quest.</p>
              <button
                onClick={ addTask }
                className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
                Add New Task
              </button>
            </div>
          </div>
        ) }

        <div className="grid gap-4 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 my-4">

          { tasks?.map( ( task: CardData, index: number ) => (
            <div
              key={ index }
              className="border border-gray-200 bg-white/5 p-4 rounded-xl shadow-lg hover:bg-white/10 cursor-pointer"
              onClick={ () => handleCardClick( task ) }
            >
              <h2 className="text-xl font-medium mb-2">{ task.type }</h2>
              <p className="text-sm mb-2">{ task.description }</p>
              <div className="flex justify-between items-center">
                <span className="bg-purple-500 text-white px-2 py-1 rounded-lg text-xs">
                  { task.category }
                </span>
                <span className="text-sm">
                  Completions: { task.completions.length }
                </span>
              </div>
            </div>
          ) ) }
        </div>
      </div>

      { selectedCard && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="relative p-4 w-full max-w-4xl">
            <div className="relative bg-[#282828] rounded-3xl shadow text-white">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-white">
                  { selectedCard.name } Completions
                </h3>
                <button
                  onClick={ handleClosePopup }
                  className="text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-4 md:p-5 max-h-[70vh] overflow-y-auto">
                { selectedCard.completions.length > 0 ? (
                  <table className="w-full text-sm text-left text-gray-200">
                    <thead className="text-xs text-gray-100 uppercase bg-gray-700">
                      <tr>
                        <th scope="col" className="px-6 py-3">User ID</th>
                        <th scope="col" className="px-6 py-3">User Name</th>
                        <th scope="col" className="px-6 py-3">Completed At</th>
                        <th scope="col" className="px-6 py-3">Submission</th>
                      </tr>
                    </thead>
                    <tbody>
                      { selectedCard.completions.map( ( completion, index ) => (
                        <tr key={ index } className="bg-gray-800 border-b border-gray-700">
                          <td className="px-6 py-4">{ completion.user }</td>
                          <td className="px-6 py-4">{ completion?.userName }</td>
                          <td className="px-6 py-4">{ new Date( completion.completedAt ).toLocaleString() }</td>
                          <td className="px-6 py-4">{ completion.submission }</td>
                        </tr>
                      ) ) }
                    </tbody>
                  </table>
                ) : (
                  <p className="text-center text-gray-400">No completions yet.</p>
                ) }
              </div>
            </div>
          </div>
        </div>
      ) }
    </div>
  );
};

export default QuestPage;