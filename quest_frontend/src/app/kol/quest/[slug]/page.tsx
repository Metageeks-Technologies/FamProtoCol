"use client";
import { deleteTask, fetchTaskById } from "@/redux/reducer/taskSlice";
import { fetchQuestById } from "@/redux/reducer/questSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { ShimmerDiv, ShimmerTitle } from "shimmer-effects-react";
import { TailSpinLoader } from "@/app/components/loader";

interface Completion {
  user: string;
  completedAt: string;
  submission: string;
  userName: string;
  _id: string;
}

interface CardData {
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

const QuestPage = ({ params }: { params: { slug: string } }) => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const questId: string | any = params.slug;
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const quest = useSelector((state: RootState) => state.quest.quest);
  const { currentTask: tasks, loading } = useSelector(
    (state: RootState) => state.task
  );
  console.log("quest:-", quest);
  // console.log(tasks)
  useEffect(() => {
    dispatch(fetchQuestById(questId));
    dispatch(fetchTaskById(questId));
  }, [dispatch, questId]);

  const handleDeleteTask = (id: string) => () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      color: "white",
      background: "#171616",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result: any) => {
      if (result.isConfirmed) {
        dispatch(deleteTask(id));
        setSelectedCard(null);
        router.refresh();
        Swal.fire({
          title: "Deleted!",
          background: "#171616",
          color: "#48de02",
          text: "Your task has been deleted",
          icon: "success",
        });
      }
    });
  };

  return (
    <div className="text-white min-h-screen">
      <div className="w-[95%] mx-auto py-10">
        <div className="flex gap-4 justify-start mb-2 items-start px-4">
          {!quest && <ShimmerDiv mode="dark" height={100} width={100} />}
          {quest && (
            <div className="w-20 h-20 rounded-lg overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={quest?.logo}
                alt={quest?.title}
              />
            </div>
          )}

          <div className="flex flex-col ">
            <div className="text-2xl font-bold capitalize">{quest?.title}</div>
            <div className="w-full text-white opacity-40 flex justify-start ">
              {quest?.description || "Monitor your tasks here"}
            </div>
          </div>
        </div>
        {tasks && tasks?.length > 0 && (
          <div className="flex flex-col md:flex-row md:justify-end px-4">
            <button
              className="bg-famViolate hover:bg-violet-700 text-white font-medium w-full md:w-auto px-5 py-2 rounded-3xl"
              onClick={() => {
                router.push(`/kol/add-task/${questId}`);
              }}
            >
              Add task
            </button>
          </div>
        )}

        {loading && <TailSpinLoader />}

        {!loading && tasks.length === 0 && (
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
              <h3 className="text-xl font-medium text-white mb-2 ">
                No tasks available
              </h3>
              <p className="text-gray-400 mb-6">
                Get started by creating a new task for this quest.
              </p>
              <button
                onClick={() => {
                  router.push(`/kol/add-task/${questId}`);
                }}
                className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
                Add New Task
              </button>
            </div>
          </div>
        )}

        <div className="px-4 grid gap-4 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 my-4">
          { !loading && tasks?.map((task: CardData, index: number) => (
            <div
              key={index}
              className="border border-gray-200 bg-white/5 p-4 rounded-xl shadow-lg hover:bg-white/10 cursor-pointer"
              onClick={() => {
                setSelectedCard(task);
              }}
            >
              <h2 className="text-xl font-medium mb-2">{task.type}</h2>
              <p className="text-sm mb-2">{task.description}</p>
              <div className="flex justify-between items-center">
                <span className="bg-purple-500 text-white px-2 py-1 rounded-lg text-xs">
                  {task.category}
                </span>
                <span className="text-sm">
                  Completions: {task.completions.length}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedCard && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="relative p-4 w-full max-w-4xl">
            <div className="relative bg-[#282828] rounded-3xl shadow text-white">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-white">
                  {selectedCard.name} Completions
                </h3>
                <button
                  onClick={() => {
                    setSelectedCard(null);
                  }}
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
              <div className="flex justify-end items-center">
                <button
                  onClick={handleDeleteTask(selectedCard._id)}
                  className="px-2 py-1 mr-2 mt-2 font-semibold rounded-full text-white bg-famViolate hover:text-gray-400"
                >
                  <i className="bi bi-trash-fill"></i> Delete task
                </button>
              </div>
              <div className="p-4 md:p-5 max-h-[70vh] overflow-y-auto">
                {selectedCard.completions.length > 0 ? (
                  <table className="w-full text-sm text-left text-gray-200">
                    <thead className="text-xs text-gray-100 uppercase bg-gray-700">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          User ID
                        </th>
                        <th scope="col" className="px-6 py-3">
                          User Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Completed At
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Submission
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCard.completions.map((completion, index) => (
                        <tr
                          key={index}
                          className="bg-gray-800 border-b border-gray-700"
                        >
                          <td className="px-6 py-4">{completion.user}</td>
                          <td className="px-6 py-4">{completion?.userName}</td>
                          <td className="px-6 py-4">
                            {new Date(completion.completedAt).toLocaleString()}
                          </td>
                          <td className="px-6 py-4">{completion.submission}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-center text-gray-400">
                    No completions yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestPage;
