import { Progress } from "@nextui-org/react";
import {HeaderProps} from "@/types/types";
import { ShimmerDiv } from "shimmer-effects-react";


export const Header: React.FC<HeaderProps> = ({quest}) => (
  <>
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
  </>
);

export const StatusBar: React.FC<{ progress: number }> = ({ progress }) => (
  <>
    <div className="flex flex-col md:flex-row md:justify-between">
      <div className="max-w-[600px] pt-4 text-gray-400 flex justify-end">
        <p className="text-white mb-6">
          Monitor task completions and submissions.
        </p>
      </div>
      <div className="md:pt-6 md:inline-block">
        <button
          className="bg-gray-700 hover:bg-gray-900 text-white font-medium w-full md:w-auto px-5 py-2 rounded-3xl"
          onClick={() => window.history.back()}
        >
          Go Back
        </button>
      </div>
    </div>

    <div className="banner ">
      <h1 className="text-2xl inline mr-8 pb-10 mb-2 ">Progress Bar</h1>
      <span className="text-sm font-medium text-green-700 pb-10 dark:text-white">
        {progress}%
      </span>
      <Progress
        value={progress}
        isStriped
        aria-label="Loading..."
        classNames={{
          track: "drop-shadow-md border border-default",
          indicator: "bg-pink-400",
          label: "tracking-wider font-medium text-default-600",
        }}
      />
    </div>
  </>
);
export const NoTasks: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-[60vh]">
    <div className="text-center bg-white/5 p-8 rounded-xl shadow-lg max-w-md w-full">
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
      <h3 className="text-xl font-medium text-white mb-2">
        No tasks available
      </h3>
      <p className="text-gray-400 mb-6">
        Get started by creating a new task for this quest.
      </p>
      <button
        className="bg-gray-700 hover:bg-gray-900 text-white font-medium w-full md:w-auto px-5 py-2 rounded-3xl"
        onClick={() => window.history.back()}
      >
        Go Back
      </button>
    </div>
  </div>
);