declare global
{
  interface Window
  {
    ethereum?: any;
  }

  //using for type check
  type TaskType = {
    _id: string;
    connectedWallets?: string[];
    walletsToConnect?: number;
  };
}
"use client";
import QuizPollCarousel from "@/app/components/QuizPollCarousel";
import { fetchTaskById, completeTask, connetToWallets, fetchTasks } from "@/redux/reducer/taskSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { notify } from "@/utils/notify";
import { Button, Progress } from "@nextui-org/react";
import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ethers } from 'ethers';
import { GITCOIN_PASSPORT_WEIGHTS } from './stamp-weights';
import { useRouter } from "next/navigation";


// types.ts

export interface QuizQuestion
{
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface PollQuestion
{
  question: string;
  options: string[];
}

export interface Completion
{
  user: string;
  completedAt: string;
  submission: string;
}

export interface CardData
{
  _id: string;
  image: string;
  name: string;
  taskName: string;
  guild?: string;
  discord?: string;
  discordLink?: string;
  taskDescription: string;
  description: string;
  type: string;
  category: string;
  visitLink?: string;
  quizzes?: QuizQuestion[];
  polls?: PollQuestion[];
  inviteLink?: string;
  uploadLink?: string;
  completions: Completion[];
  uploadFileType?: string;
  walletsToConnect?: number;
  connectedWallets?: [ string ];
  opinionQuestion?:string;
}

const QuestPage: React.FC<{ params: { slug: string; }; }> = ( { params } ) =>
{
  const dispatch: AppDispatch = useDispatch();
  const questId: string = params.slug;
  const [ referral, setReferral ] = useState<string>( 'Please Generate Referral' );
  const [ selectedCard, setSelectedCard ] = useState<CardData | null>( null );
  const [ submissions, setSubmissions ] = useState<{ [ key: string ]: string | File; }>( {} );
  const [ progress, setProgress ] = useState<any>( 0 );
  const [ allTasksCompletedCalled, setAllTasksCompletedCalled ] = useState<boolean>( false );

  const user = useSelector( ( state: RootState ) => state.login.user );
  console.log( "user:-", user );
  const tasks = useSelector( ( state: RootState ) => state.task.currentTask );
  useEffect( () =>
  {
    dispatch( fetchTaskById( questId ) );
    dispatch( fetchTasks() );
  }, [ dispatch, questId ] );

  useEffect( () =>
  {
    const completedTasks = tasks.filter( ( task ) => isTaskCompleted( task ) ).length;
    const progressPercentage = ( ( completedTasks / tasks.length ) * 100 );

    setProgress( progressPercentage.toFixed( 2 ) );
    if ( progressPercentage === 100 && !allTasksCompletedCalled )
    {
      handleAllTasksCompleted();
    }
  }, [ tasks, allTasksCompletedCalled ] );

  const handleCardClick = useCallback( ( card: CardData ) =>
  {
    setSelectedCard( card );
    setSubmissions( {} );
  }, [] );

  const handleClosePopup = useCallback( () =>
  {
    setSelectedCard( null );
    setSubmissions( {} );
  }, [] );

  const handleSubmission = useCallback( async ( taskId: string, submissionData?: { [ key: string ]: any; } ) =>
  {
    try
    {
      let submission = submissionData || submissions[ taskId ];

      if ( selectedCard?.type === "Opinion Scale" )
      {
        submission = { opinionRating: submissionData?.opinionRating };
      }
      console.log( "submission from submission",submission );
      // Validate submission based on task type

      if ( !validateSubmission( selectedCard?.type, submission ) )
      {
        console.log( selectedCard )

        notify( "warn", "Invalid submission. Please check your input." );
        return;
      }

      if ( selectedCard?.type === "File upload" && submissions[ taskId ] instanceof File )
      {
        const uploadSuccess = await handleUpload( submissions[ taskId ] as File );

        if ( !uploadSuccess )
        {
          console.error( "File upload failed" );
          notify( "error", "File upload failed" );
          return;
        }

        const uploadLink = `https://${ process.env.NEXT_PUBLIC_S3_BUCKET_NAME }.s3.amazonaws.com/taskByUser/${ ( submissions[ taskId ] as File ).name }`;
        submission = uploadLink;
      }

      const data = {
        taskId,
        userId: user?._id,
        userName: user?.displayName,
        submission: JSON.stringify( submission ),
      };
      await dispatch( completeTask( data ) );
      notify( 'success', 'your rewards are added to your profile' );
      window.location.reload();
    } catch ( error )
    {
      console.log( "Error in completing the task:", error );
      notify( "error", "An error occurred while submitting the task. Please try again." );
    }
  }, [ dispatch, selectedCard, submissions, user ] );

  const handleFileInputChange = useCallback( ( taskId: string, file: File ) =>
  {
    setSubmissions( prev => ( { ...prev, [ taskId ]: file } ) );
  }, [] );

  const validateSubmission = ( taskType: string | undefined, submission: any ): any =>
  {

    switch ( taskType )
    {
      case "Text":
        return typeof submission === 'string' && submission.trim().length > 0;
      case "Number":
        return !isNaN( Number( submission ) ) && submission !== '';
      case "URL":
        const urlPattern = /^(http)/;
        return urlPattern.test( submission );
      case "File upload":
        return submission instanceof File && submission.size > 0;
      case "Invites":
        return typeof submission === 'string' && submission.trim().length > 0;
      case "Visit Link":
        return true;
      case "Poll":
      case "Quiz":
        return typeof submission === 'object' && Object.keys( submission ).length > 0;
      case "Opinion Scale":
        return typeof submission === 'object' && typeof submission.opinionRating === 'string' && submission.opinionRating >= 1 && submission.opinionRating <= 5; 
      case "Connect wallet":
        return true;
      case "Gitcoin passport":
        return true;
      case "Civic pass verification":
        return true;
      case "Ens holder":
        return true;
      case "Eth holder":
        return true;
      case "Connect multiple wallet":
        return true;
      // default:
      //   console.log( "validation is complete, no matches found" );
      //   return false;
    }
  };

  const handleGenerateReferral = useCallback( async () =>
  {
    try
    {
      const formData = {
        userId: user?._id,
        questId,
        taskId: selectedCard?._id,
        expireDate: 5
      };
      const response = await axios.post( `${ process.env.NEXT_PUBLIC_SERVER_URL }/task/get/referral`, formData, {
        withCredentials: true,
      } );
      setReferral( response.data );
    } catch ( error )
    {
      console.error( "Error generating referral:", error );
    }
  }, [ user?._id, questId, selectedCard?._id ] );

  const getUploadUrl = useCallback( async ( fileName: string ) =>
  {
    try
    {
      const response = await axios.post( `${ process.env.NEXT_PUBLIC_SERVER_URL }/aws/generate-upload-url`, {
        folder: 'taskByUser',
        fileName,
      } );
      return response.data.url;
    } catch ( error )
    {
      console.error( 'Error getting upload URL:', error );
      throw error;
    }
  }, [] );

  const handleUpload = useCallback( async ( file: File ) =>
  {
    if ( !file ) return false;
    try
    {
      const uploadUrl = await getUploadUrl( file.name );
      if ( !uploadUrl ) return false;
      const res = await axios.put( uploadUrl, file, {
        headers: { 'Content-Type': file.type },
      } );
      return res.status === 200;
    } catch ( error )
    {
      console.log( 'Error uploading file:', error );
      return false;
    }
  }, [ getUploadUrl ] );

  const handleInputChange = useCallback( ( questionIndex: string, value: string ) =>
  {
    setSubmissions( prev => ( { ...prev, [ questionIndex ]: value } ) );
  }, [] );

  const isTaskCompleted = useCallback( ( task: CardData ) =>
  {
    return task.completions?.some( completion => completion?.user === user?._id );
  }, [ user?._id ] );

  // Reward claim
  const handleAllTasksCompleted = useCallback( async () =>
  {
    if ( allTasksCompletedCalled ) return;
    setAllTasksCompletedCalled( true );
    try
    {
      const response = await axios.post( `${ process.env.NEXT_PUBLIC_SERVER_URL }/task/claim`, {
        userId: user?._id,
        questId,
      } );
      console.log( "All tasks completed response:", response.data );
      // Reset the flag if you want to allow future calls
      // setAllTasksCompletedCalled(false);
    } catch ( error ) 
    {
      console.error( "Error making POST request for completed tasks:", error );
      setAllTasksCompletedCalled( false ); // Reset on error to allow retry
    }
  }, [ questId, user?._id, allTasksCompletedCalled ] );


  return (
    <div className="bg-[#000000] text-white h-full">
      <div className="mx-4 lg:mx-20">
        <Header />
        { tasks.length > 0 ? (
          <>
            <StatusBar progress={ progress } />
            <TaskCards tasks={ tasks } isTaskCompleted={ isTaskCompleted } onCardClick={ handleCardClick } />
          </>
        ) : (
          <NoTasks />
        ) }
      </div>
      { selectedCard && (
        <Popup
          selectedCard={ selectedCard }
          isCompleted={ isTaskCompleted( selectedCard ) }
          submissions={ submissions }
          onClose={ handleClosePopup }
          onSubmit={ handleSubmission }
          onFileInputChange={ handleFileInputChange }
          onInputChange={ handleInputChange }
          onGenerateReferral={ handleGenerateReferral }
          referral={ referral }
          validateSubmission={ validateSubmission }
        />
      ) }
    </div>
  );
};


const Header: React.FC = () => (
  <>
    <div className="text-2xl pt-10 font-bold">
      <h1>My Quest</h1>
    </div>
    <div className="max-w-[600px] pt-4 text-white">
      <p>Complete the following tasks to progress in your quest.</p>
    </div>
  </>
);

const StatusBar: React.FC<{ progress: number; }> = ( { progress } ) => (
  <>
    <div className="flex flex-col md:flex-row md:justify-between">
      <div className="max-w-[600px] pt-4 text-gray-400 flex justify-end">
        <p className="text-white mb-6">Monitor task completions and submissions.</p>
      </div>
      <div className="md:pt-6 md:inline-block">
        <button
          className="bg-gray-700 hover:bg-gray-900 text-white font-medium w-full md:w-auto px-5 py-2 rounded-3xl"
          onClick={ () => window.history.back() }
        >
          Go Back
        </button>
      </div>
    </div>

    <div className="banner ">
      <h1 className="text-2xl inline mr-8 pb-10 ">Getting started</h1>
      <span className="text-sm font-medium text-green-700 pb-10 dark:text-white">
        { progress }%
      </span>
      <Progress
        value={ progress }
        isStriped
        aria-label="Loading..."
        classNames={ {
          track: "drop-shadow-md border border-default",
          indicator: "bg-pink-400",
          label: "tracking-wider font-medium text-default-600",
        } }
      />
    </div>

  </>
);


const NoTasks: React.FC = () => (
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
      <h3 className="text-xl font-medium text-white mb-2">No tasks available</h3>
      <p className="text-gray-400 mb-6">Get started by creating a new task for this quest.</p>
      <button
        className="bg-gray-700 hover:bg-gray-900 text-white font-medium w-full md:w-auto px-5 py-2 rounded-3xl"
        onClick={ () => window.history.back() }
      >
        Go Back
      </button>
    </div>
  </div>
);

const TaskCards: React.FC<{
  tasks: CardData[],
  isTaskCompleted: ( task: CardData ) => boolean,
  onCardClick: ( task: CardData ) => void;
}> = ( { tasks, isTaskCompleted, onCardClick } ) => (
  <div className="grid gap-4 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pt-10 text-white">
    { tasks.map( ( task: CardData, index: number ) => (
      <div
        key={ task._id || index }
        className={ `border cursor-pointer border-gray-200 bg-white/5 sm:p-2 lg:py-4 rounded-xl h-full w-full shadow-lg group hover:scale-105 hover:bg-white/10 ${ isTaskCompleted( task ) ? 'opacity-50' : ''
          }` }
        onClick={ () => onCardClick( task ) }
      >
        <div className="flex gap-3 items-center justify-between mx-2">
          <div className="basis-[65%]">
            <h1 className="text-lg font-semibold text-gray-200 group-hover:text-white">
              { task.taskName || task.type }
            </h1>
            <p className="text-sm text-gray-400">
              { task.taskDescription || 'No description' }
            </p>
          </div>
          <div className="basis-[25%]">
            <div className="relative flex justify-center">
              <img
                src={ task.image || "https://zealy.io/nstatic/xp-reward.webp" }
                alt="Task Image"
                className="w-full h-auto rounded-lg"
              />
              <div className="absolute bottom-0 bg-purple-500 opacity-40 text-white px-2 rounded-lg flex justify-center mr-2.5">
                <p>{ task?.category }</p>
              </div>
            </div>
          </div>
        </div>
        { isTaskCompleted( task ) && (
          <div className="mt-2 text-green-400 text-sm">Completed</div>
        ) }
      </div>
    ) ) }
  </div>
);

const Popup: React.FC<{
  selectedCard: CardData;
  isCompleted: boolean;
  submissions: { [ key: string ]: string | File; };
  referral: string;
  onGenerateReferral: () => void;
  onClose: () => void;
  onSubmit: ( taskId: string, submissionData?: { [ key: string ]: string; } ) => void;
  onFileInputChange: ( taskId: string, file: File ) => void;
  onInputChange: ( questionIndex: string, value: string ) => void;
  validateSubmission: ( taskType: string | undefined, submission: any ) => boolean;
}> = ( {
  selectedCard,
  isCompleted,
  submissions,
  onClose,
  onSubmit,
  onFileInputChange,
  onInputChange,
  onGenerateReferral,
  referral,
  validateSubmission
} ) =>
  {
    const [ linkClicked, setLinkClicked ] = useState( false );
    const [ isMember, setIsMember ] = useState<boolean>( false );
    const dispatch = useDispatch<AppDispatch>();
    const [ address, setAddress ] = useState<string>( '' );
    const [ balance, setBalance ] = useState<string>( '' );
    const [ isENSHolder, setIsENSHolder ] = useState<boolean>( false );
    const [ isETHHolder, setIsETHHolder ] = useState<boolean>( false );
    const [ showStamps, setShowStamps ] = useState( false );
    const [ tasks, setTasks ] = useState<TaskType[]>( [] ); // TaskType should be replaced with your task object type
  // const [tasks, setTasks] = useState<any[]>([]);
  const [ selectedValue, setSelectedValue ] = useState( 3 );
    const [ score, setScore ] = useState( 0 );
    const [ showScore, setShowScore ] = useState( false );
    const [ stampArray, setStampArray ] = useState<Array<Stamp>>( [] );
    const user = useSelector( ( state: RootState ) => state.login.user );
    const router = useRouter();
    // const tasks = useSelector( ( state: RootState ) => state.task.tasks );
    const [ localConnectedWallets, setLocalConnectedWallets ] = useState<any>( [] );

    useEffect( () =>
    {
      if ( selectedCard?.connectedWallets )
      {
        setLocalConnectedWallets( selectedCard?.connectedWallets );
      }

      // fetchData();
    }, [ selectedCard ] );

    // const fetchData = async () =>
    // {
    //   await dispatch( fetchTaskById( selectedCard?._id ) );
    // };

    const connectMultipleWallet = async () =>
    {
      try
      {
        if ( typeof window.ethereum === 'undefined' )
        {
          if ( confirm( "MetaMask is not installed. Would you like to download it now?" ) )
          {
            window.open( "https://metamask.io/download.html", "_blank" );
          }
          return;
        }

        const provider = new ethers.BrowserProvider( window.ethereum );
        const [ accountAddress ] = await provider.send( 'eth_requestAccounts', [] );

        if ( !accountAddress )
        {
          notify( "warn", "No Ethereum account connected. Please connect your wallet." );
          return;
        }

        if ( selectedCard?.connectedWallets?.includes( accountAddress ) )
        {
          notify( "warn", "This wallet is already connected." );
          return;
        }

        const balance = await provider.getBalance( accountAddress );
        setBalance( ethers.formatEther( balance ) );

        console.log( 'Wallet connected:', accountAddress );

        // Update the backend and refresh task data
        await Promise.all( [
          dispatch( connetToWallets( { taskId: selectedCard?._id, address: accountAddress } ) ),
          dispatch( fetchTaskById( selectedCard?._id ) )
        ] );

        // Update local state immediately
        setLocalConnectedWallets( ( prev: any ) => [ ...prev, accountAddress ] );

        // const connectedWalletsCount = Number(selectedCard?.connectedWallets?.length) ?? 0;
        const newConnectedWalletsCount = localConnectedWallets?.length + 1;
        if ( newConnectedWalletsCount === ( selectedCard?.walletsToConnect ) )
        {
          onSubmit( selectedCard._id, { visit: 'All required wallets connected' } );
        }

      } catch ( error )
      {
        console.error( "Error connecting wallet:", error );
        notify( "error", "Failed to connect wallet. Please try again." );
      }
    };

    const handleLinkClick = () =>
    {
      setLinkClicked( true );

    };

    const handleVisibilityChange = () =>
    {
      if ( !document.hidden && linkClicked )
      {
        checkMembership();

        // Perform actions when the user returns to the tab after clicking the link
        setLinkClicked( false ); // Reset the state if you only want to handle it once
      }
    };
    const checkMembership = async () =>
    {
      const data = user?.discordInfo?.discordId;
      const accessToken = user?.discordInfo?.accessToken;
      const guildId = selectedCard?.guild;
      try
      {
        const response = await axios.post( `${ process.env.NEXT_PUBLIC_SERVER_URL }/auth/check-discord-membership`, {
          data,
          accessToken,
          guildId,
        },
        );
        const discordShip = response.data.isMember;
        const datas = {
          taskId: selectedCard._id,
          userId: user?._id,
          userName: user?.displayName,
          submission: "Join Discord Successfully "
        };
        if ( discordShip )
        {
          notify( "success", "Join Successful" );
          await dispatch( completeTask( datas ) );
          router.refresh();
          onClose();

        } else
        {
          notify( "error", "Please join Not a member" );

        }
        setIsMember( true );
      } catch ( error )
      {
        console.error( 'Error checking Discord membership:', error );
        setIsMember( false );
      }
    };

    useEffect( () =>
    {
      window.addEventListener( 'beforeunload', handleLinkClick );
      document.addEventListener( 'visibilitychange', handleVisibilityChange );
      return () =>
      {
        window.removeEventListener( 'beforeunload', handleLinkClick );
        document.removeEventListener( 'visibilitychange', handleVisibilityChange );
      };
    }, [ linkClicked ] );

  const handleSubmit = () =>
  {
    if ( selectedCard.type === "Opinion Scale" )
    {
      if ( selectedValue )
      {
        onSubmit( selectedCard._id, { opinionRating: selectedValue.toString() } );
      } else
      {
        notify( "warn", "Please select a rating before submitting." );
      }
    } else if ( validateSubmission( selectedCard.type, submissions[ selectedCard._id ] ) )
    {
      onSubmit( selectedCard._id );
    } else
    {
      notify( "warn", "Invalid input. Please check your submission." );

    }
  };

    //Below line codes are using for to fetch the details form env for gitcoin api key, smart contract address and abi

    const APIKEY = process.env.NEXT_PUBLIC_GC_API_KEY;   //API key for the access of gitcoin API
    const SCORERID = process.env.NEXT_PUBLIC_GC_SCORER_ID;  //Scorer Id using to fectch the user score on behalf of stamp verification activity
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    const contractABI = process.env.NEXT_PUBLIC_CONTRACT_ABI ? JSON.parse( process.env.NEXT_PUBLIC_CONTRACT_ABI ) : null;

    // below line using for access gitcoin passport data and connectection
    const SUBMIT_PASSPORT_URI = 'https://api.scorer.gitcoin.co/registry/submit-passport';
    const SIGNING_MESSAGE_URI = 'https://api.scorer.gitcoin.co/registry/signing-message';

    const headers = APIKEY ? {
      'Content-Type': 'application/json',
      'X-API-Key': APIKEY
    } : undefined;

    interface Stamp
    {
      id: number;
      name: string;
      icon: string;
    }

    //Below codes are related to Metamask wallet connection
    useEffect( () =>
    {
      checkConnection();
    }, [] );

    const checkConnection = async () =>
    {
      if ( typeof window.ethereum === 'undefined' )
      {
        // Prompt the user to install MetaMask and provide a link
        if ( confirm( "MetaMask is not installed. Would you like to download it now?" ) )
        {
          // Open the MetaMask download page in a new tab
          window.open( "https://metamask.io/download.html", "_blank" );
        }
        return null;
      }
      try
      {
        const provider = new ethers.BrowserProvider( window.ethereum );
        const accounts = await provider.listAccounts();
        if ( accounts && accounts[ 0 ] )
        {
          setAddress( accounts[ 0 ].address );
          const balance = await provider.getBalance( accounts[ 0 ].address );
          setBalance( ethers.formatEther( balance ) );
          await checkENS( accounts[ 0 ].address );
        }
      } catch ( err )
      {
        console.log( 'Not connected...' );
      }
    };


    const connectWallet = async (): Promise<string | null> =>
    {
      try
      {
        // Check if MetaMask is installed
        if ( typeof window.ethereum === 'undefined' )
        {
          // Prompt the user to install MetaMask and provide a link
          if ( confirm( "MetaMask is not installed. Would you like to download it now?" ) )
          {
            // Open the MetaMask download page in a new tab
            window.open( "https://metamask.io/download.html", "_blank" );
          }
          return null;
        }

        const provider = new ethers.BrowserProvider( window.ethereum );
        const accounts = await provider.send( 'eth_requestAccounts', [] );

        if ( accounts.length === 0 )
        {
          alert( "No Ethereum account is connected. Please connect your wallet." );
          return null;
        }

        const accountAddress = accounts[ 0 ];
        setAddress( accountAddress );

        const balance = await provider.getBalance( accountAddress );
        setBalance( ethers.formatEther( balance ) );

        // Assuming checkENS is an async function that needs the account address
        await checkENS( accountAddress );

        console.log( 'Wallet connected:', accountAddress );
        // onSubmit(taskId, { visited: "wallet connected" });

        return accountAddress;
      } catch ( err )
      {
        console.log( 'Error connecting wallet:', err );
        return null;
      }
    };

    const connectSingleWallet = async ( taskId: any ): Promise<string | null> =>
    {
      try
      {
        // Check if MetaMask is installed
        if ( typeof window.ethereum === 'undefined' )
        {
          // Prompt the user to install MetaMask and provide a link
          if ( confirm( "MetaMask is not installed. Would you like to download it now?" ) )
          {
            // Open the MetaMask download page in a new tab
            window.open( "https://metamask.io/download.html", "_blank" );
          }
          return null;
        }

        const provider = new ethers.BrowserProvider( window.ethereum );
        const accounts = await provider.send( 'eth_requestAccounts', [] );

        if ( accounts.length === 0 )
        {
          alert( "No Ethereum account is connected. Please connect your wallet." );
          return null;
        }

        const accountAddress = accounts[ 0 ];
        setAddress( accountAddress );

        const balance = await provider.getBalance( accountAddress );
        setBalance( ethers.formatEther( balance ) );

        // Assuming checkENS is an async function that needs the account address
        // await checkENS(accountAddress);

        console.log( 'Wallet connected:', accountAddress );
        onSubmit( taskId, { visited: "wallet connected" } );

        return accountAddress;
      } catch ( err )
      {
        console.log( 'Error connecting wallet:', err );
        return null;
      }
    };

    const getSigningMessage = async () =>
    {
      try
      {
        const response = await fetch( SIGNING_MESSAGE_URI, { headers } );
        if ( !response.ok )
        {
          throw new Error( 'Failed to fetch signing message' );
        }
        return await response.json();
      } catch ( err )
      {
        console.log( 'error: ', err );
      }
    };
    // Below codes are related to gitcoin passport submission
    const submitPassport = async ( taskId: any ) =>
    {
      try
      {
        if ( !address )
        {
          await connectWallet();
          console.log( 'user address is missing' );
          return;
        }
        const { message, nonce } = await getSigningMessage();
        const provider = new ethers.BrowserProvider( window.ethereum );
        const signer = await provider.getSigner();
        const signature = await signer.signMessage( message );
        const response = await fetch( SUBMIT_PASSPORT_URI, {
          method: 'POST',
          headers,
          body: JSON.stringify( {
            address,
            scorer_id: SCORERID,
            signature,
            nonce,
          } ),
        } );
        if ( !response.ok )
        {
          throw new Error( 'Failed to submit passport' );
        }
        const data = await response.json();
        console.log( 'data:', data );
        alert( 'Passport submitted successfully' );
        onSubmit( taskId, { visited: "Passport verified" } );
        getStamps();
        calculateGitcoinScore(); // Calculate score after stamps are fetched
      } catch ( err )
      {
        console.log( 'error: ', err );
      }
    };


    const calculateGitcoinScore = () =>
    {
      let score = 0;

      console.log( "Calculating Gitcoin score..." );
      console.log( "Stamp array:", stampArray );
      console.log( "Gitcoin Passport Weights:", GITCOIN_PASSPORT_WEIGHTS );

      for ( let i = 0; i < stampArray.length; i++ )
      {
        const stampName = stampArray[ i ].name;
        console.log( `Processing stamp: ${ stampName }` );

        if ( GITCOIN_PASSPORT_WEIGHTS.hasOwnProperty( stampName ) )
        {
          try
          {
            const temp_score = GITCOIN_PASSPORT_WEIGHTS[ stampName as keyof typeof GITCOIN_PASSPORT_WEIGHTS ];
            console.log( `Adding ${ temp_score } to score for stamp: ${ stampName }` );
            score += temp_score;
          } catch ( error )
          {
            console.log( "Error adding element to cumulative score:", error );
          }
        } else
        {
          console.log( `Stamp ${ stampName } not found in GITCOIN_PASSPORT_WEIGHTS` );
        }
      }

      console.log( "Final score:", score );
      setShowScore( true );
      setScore( score );
    };

    const Score = () =>
    {
      return (
        <>
          <p> Your Gitcoin score is { score }</p>
        </>
      );
    };




    const getStamps = async () =>
    {
      const stampProviderArray: Stamp[] = [];
      const GET_PASSPORT_STAMPS_URI = `https://api.scorer.gitcoin.co/registry/stamps/${ address }?include_metadata=true`;

      try
      {
        const response = await fetch( GET_PASSPORT_STAMPS_URI, { headers } );
        if ( !response.ok )
        {
          throw new Error( 'Failed to fetch stamps' );
        }

        const data = await response.json();
        let counter = 0;
        for ( const item of data.items )
        {
          const stamp: Stamp = {
            id: counter,
            name: item.credential.credentialSubject.provider,
            icon: item.metadata.platform.icon,
          };
          stampProviderArray.push( stamp );
          counter += 1;
        }

        setStampArray( stampProviderArray );
        setShowStamps( true );
        console.log( 'Fetched stamps:', stampProviderArray );
      } catch ( err )
      {
        console.log( 'Error fetching stamps:', err );
      }
    };

    //Below codes are using for checking the civic pass verification if civic pass true then user can able to proceed the action
    //   const checkCivicPass = async (taskId: any) => {
    //     if (!contractAddress || !contractABI || !address) {
    //       await connectWallet(selectedCard._id);
    //       console.log('Contract address, ABI is missing')
    //       return
    //     }
    //     try {
    //       const provider = new ethers.BrowserProvider(window.ethereum)
    //       const signer = await provider.getSigner()
    //       const contract = new ethers.Contract(contractAddress, contractABI, signer)
    //         const result = await contract.verifyCivicPass();
    //         if (result) {
    //             console.log("User has a valid Civic Pass.");
    //             // Proceed with the action
    //             onSubmit( taskId, {visited: "Civic Pass Verified"} )
    //         }
    //     } catch (error) {
    //         console.error("User does not have a valid Civic Pass:", error);
    //         alert("You do not have a valid Civic Pass verification.");
    //     }
    // }
    const checkCivicPass = async ( taskId: any ) =>
    {
      if ( !contractAddress || !contractABI || !address )
      {
        await connectWallet();
        console.log( 'Contract address, ABI is missing' );
        return;
      }
      try
      {
        const provider = new ethers.BrowserProvider( window.ethereum );
        const signer = await provider.getSigner();
        const contract = new ethers.Contract( contractAddress, contractABI, signer );
        const result = await contract.verifyCivicPass();
        if ( result )
        {
          console.log( "User has a valid Civic Pass." );
          // Proceed with the action
          onSubmit( taskId, { visited: "Civic Pass Verified" } );
        }
      } catch ( error )
      {
        console.error( "User does not have a valid Civic Pass:", error );
        if ( confirm( `You do not have a valid Civic Pass verification. Would you like to visit the Civic Pass verification site?` ) )
        {
          window.open( 'https://civic.me/', '_blank' );
        }
      }
    };


    //Below codes are using to checkENS on connected user address, if user address hold any ENS then he will be able to proceed with action
    const checkENS = async ( taskId: any ) =>
    {
      try
      {
        if ( !address )
        {
          await connectWallet();
          if ( !address )
          { // Re-check address after attempting to connect
            console.log( 'User address is still missing' );
            return;
          }
        }
        const provider = new ethers.BrowserProvider( window.ethereum );
        const ensName = await provider.lookupAddress( address ); // Use 'address' instead of 'userAddress'
        if ( ensName )
        {
          setIsENSHolder( true );
          console.log( `ENS name found: ${ ensName }` );
          onSubmit( taskId, { visited: "User address holds ENS" } );
        } else
        {
          setIsENSHolder( false );
          // Use a confirm dialog instead of alert
          const userConfirmed = window.confirm(
            'No ENS name found. Would you like to visit the ENS domain services to register an ENS name?'
          );
          if ( userConfirmed )
          {
            window.open( 'https://app.ens.domains/', '_blank' );
          }
          console.log( 'No ENS name found' );
        }
      } catch ( err )
      {
        console.log( 'Error checking ENS:', err );
      }
    };


    //Below codes are using to checkETH balance on connected user address, if user address hold any amount of ETH then he will be able to proceed with action
    const checkETHBalance = async ( taskId: any ) =>
    {
      try
      {
        if ( !address )
        {
          const connectedAddress = await connectWallet();
          if ( !connectedAddress )
          {
            console.log( 'User address is still missing' );
            return;
          }
        }
        if ( parseFloat( balance ) > 0 )
        {
          setIsETHHolder( true );
          console.log( `ETH balance: ${ balance }` );
          alert( `ETH balance: ${ balance }` );
          onSubmit( taskId, { visited: "User address holds ETH" } );
        } else
        {
          setIsETHHolder( false );
          console.log( 'No ETH balance found' );
          alert( 'Your account does not hold any ETH balance' );
        }
      } catch ( err )
      {
        console.log( 'Error checking ETH balance:', err );
      }
    };

    // validation for file upload
    const getFileTypeInfo = ( uploadFileType: any ) =>
    {
      switch ( uploadFileType )
      {
        case 'image':
          return '.jpg, .png, .gif';
        case 'audio':
          return '.mp3, .wav';
        case 'video':
          return '.mp4, .mov';
        case 'document':
          return '.pdf, .doc, .txt';
        case 'spreadsheet':
          return '.xlsx, .csv';
        case 'code':
          return '.js, .py, .html';
        case '3d':
          return '.obj, .fbx';
        case 'archive':
          return '.zip, .rar';
        default:
          return '';
      }
    };


    const getAcceptedFileTypes = ( uploadFileType: string | any ) =>
    {
      switch ( uploadFileType )
      {
        case 'image':
          return 'image/jpeg,image/png,image/gif';
        case 'audio':
          return 'audio/mpeg,audio/wav';
        case 'video':
          return 'video/mp4,video/quicktime';
        case 'document':
          return '.pdf,.doc,.docx,.txt';
        case 'spreadsheet':
          return '.xlsx,.csv';
        case 'code':
          return '.js,.py,.html';
        case '3d':
          return '.obj,.fbx';
        case 'archive':
          return '.zip,.rar';
        default:
          return '';
      }
    };

    const validateFileType = ( file: any, uploadFileType: string | any ) =>
    {
      const acceptedTypes = getAcceptedFileTypes( uploadFileType ).split( ',' );
      return acceptedTypes.some( type =>
      {
        if ( type.startsWith( '.' ) )
        {
          return file.name.toLowerCase().endsWith( type );
        } else
        {
          return file.type === type;
        }
      } );
    };

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
        <div className="relative p-4 w-full max-w-md">
          <div className="relative bg-[#282828] rounded-3xl shadow text-white">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <div className="flex items-center">
                <div className="mx-2">
                  <h3 className="text-lg font-semibold text-white">
                    { selectedCard.taskName || "No Task Name" }
                  </h3>
                </div>
              </div>
              <button
                onClick={ onClose }
                className="text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="p-4 md:p-5">
              { isCompleted ? (
                <div className="text-green-400 text-center py-4">
                  You have already completed this task!
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-100 mb-4">
                    { selectedCard.taskDescription || "No description " }
                  </p>

                  { selectedCard.type === "Visit Link" && (
                    <div>
                      <a
                        href={ selectedCard.visitLink }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white underline"
                        onClick={ () => onSubmit( selectedCard._id, { visited: "true" } ) }
                      >
                        Visit this link
                      </a>
                    </div>
                  ) }

                  { selectedCard.type === "Discord" && (
                    <div >

                      <div className="flex justify-center items-center">

                        <a
                          href={ selectedCard.discordLink }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white bg-[#8e25ff] hover:bg-[#953ff1] font-bold py-2 px-4 rounded-full"
                          onClick={ handleLinkClick }
                        // onClick={ () => onSubmit( selectedCard._id, { visited: "true" } ) }
                        >
                          Join Server

                        </a>
                      </div>

                    </div>
                  ) }

                  { ( selectedCard.type === "Poll" || selectedCard.type === "Quiz" ) && (
                    <QuizPollCarousel
                      selectedCard={ selectedCard }
                      handleSubmit={ ( answers ) => onSubmit( selectedCard._id, answers ) }
                    />
                  ) }

                  { selectedCard.type === "Invites" && (
                    <div className="flex flex-col">
                      <p>Referral Code:</p>
                      <div className="flex justify-center items-center space-x-2 my-2">
                        <input
                          type="text"
                          value={ referral }
                          readOnly
                          className="text-xl font-bold bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 w-full"
                        />
                        <button
                          onClick={ () =>
                          {
                            navigator.clipboard.writeText( referral );
                            notify( "default", 'Referral code copied to clipboard!' );
                          } }
                          className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors duration-300"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 } d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                      <button
                        className="p-2 rounded-2xl bg-purple-600 text-white px-4 m-3 hover:bg-purple-700 transition-colors duration-300"
                        onClick={ onGenerateReferral }
                      >
                        Generate Referral
                      </button>
                    </div>
                    ) } 

                  { selectedCard.type === "File upload" && (
                    <div>
                      { selectedCard.uploadFileType && (
                        <p className="text-sm text-gray-300 mb-2">
                          Please upload a { selectedCard?.uploadFileType } file. Accepted formats: { getFileTypeInfo( selectedCard.uploadFileType ) }
                        </p>
                      ) }
                      <input
                        type="file"
                        className="w-full p-2 border rounded-lg mb-2 bg-[#282828]"
                        accept={ getAcceptedFileTypes( selectedCard?.uploadFileType ) }
                        onChange={ ( e ) =>
                        {
                          const file = e.target.files?.[ 0 ];
                          if ( file )
                          {
                            if ( validateFileType( file, selectedCard?.uploadFileType ) )
                            {
                              onFileInputChange( selectedCard._id, file );
                            } else
                            {
                              alert( `Please upload a valid ${ selectedCard.uploadFileType } file.` );
                            }
                          }
                        } }
                      />
                    </div>
                  ) }

                  { ( selectedCard.type === "Text" || selectedCard.type === "Number" ) && (
                    <input
                      type={ `${ selectedCard.type.toLowerCase() }` }
                      className="w-full p-2 border rounded-lg mt-2 bg-[#282828]"
                      placeholder={ `Please Enter ${ selectedCard.type }` }
                      value={ submissions[ selectedCard._id ] as string || '' }
                      onChange={ ( e ) => onInputChange( selectedCard._id, e.target.value ) }
                    />
                  ) }

                  { selectedCard.type === "URL" && (
                    <input
                      type="url"
                      className="w-full p-2 border rounded-lg mt-2 bg-[#282828]"
                      placeholder="https://"
                      // value={ submissions[ selectedCard._id ] as string || '' }
                      onChange={ ( e ) =>
                        onInputChange( selectedCard._id, e.target.value )

                      }
                    />
                  ) }

                    { selectedCard.type === "Opinion Scale" && (
                      <div className="flex flex-col mt-4 bg-gradient-to-br from-indigo-800 via-purple-700 to-pink-600 p-8 rounded-2xl shadow-2xl">
                        <h2 className="text-2xl text-white font-bold mb-4 text-center">
                          { selectedCard?.opinionQuestion }
                        </h2>
                        <p className="text-sm text-gray-200 mb-6 text-center">
                          Drag the slider or click a number to rate your opinion
                        </p>
                        <div className="relative mb-8">
                          <input
                            type="range"
                            min="1"
                            max="5"
                            value={ selectedValue || 3 } 
                            onChange={ ( e ) => setSelectedValue( Number( e.target.value ) ) }
                            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between mt-2">
                            { [ 1, 2, 3, 4, 5 ].map( ( value ) => (
                              <button
                                key={ value }
                                className={ `w-10 h-10 rounded-full text-lg font-bold transition-all duration-300 ease-in-out transform hover:scale-110
              ${ selectedValue === value
                                    ? 'bg-white text-indigo-600 scale-125 shadow-lg'
                                    : 'bg-indigo-400 text-white hover:bg-indigo-300' }` }
                                onClick={ () => setSelectedValue( value ) }
                              >
                                { value }
                              </button>
                            ) ) }
                          </div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-300 font-medium">
                          <span>Strongly Disagree</span>
                          <span>Strongly Agree</span>
                        </div>
                        <div className="mt-8 text-center">
                          <p className="text-xl text-white font-semibold mb-2">Your Rating</p>
                          <div className="text-5xl text-white font-bold animate-pulse">
                            { selectedValue || "-" }
                          </div>
                        </div>
                      </div>
                    ) }

                  { selectedCard.type === "Connect wallet" && (
                    <Button variant="solid"
                      color="primary"
                      className="justify-center text-center "
                      onClick={ () => connectSingleWallet( selectedCard._id ) }>
                      Connect your wallet
                    </Button>
                  ) }
                  { selectedCard.type === "Connect wallet" && address && balance && (
                    <div className="mt-4">
                      <p className="text-white">Address: { address }</p>
                      <p className="text-white">Balance: { balance } ETH</p>
                    </div>
                  ) }

                  { selectedCard.type === "Gitcoin passport" && (
                    <Button variant="solid"
                      color="primary"
                      className="justify-center text-center "
                      onClick={ () => submitPassport( selectedCard._id ) }>
                      Submit Gitcoin passport
                    </Button>
                  ) }
                  { selectedCard.type === "Gitcoin passport" && showScore && (
                    <Button variant="solid"
                      color="primary"
                      className="justify-center text-center"
                      onClick={ Score }>
                      gitcoin score
                    </Button>
                  ) }

                  { selectedCard.type == "Civic pass verification" && (
                    <Button variant="solid"
                      color="primary"
                      className="justify-center text-center "
                      onClick={ () => checkCivicPass( selectedCard._id ) }>
                      Verify the Civic pass
                    </Button>
                  ) }

                  { selectedCard.type == "Ens holder" && (
                    <Button variant="solid"
                      color="primary"
                      className="justify-center text-center "
                      onClick={ () => checkENS( selectedCard._id ) } >

                      Verify the account
                    </Button>
                  ) }
                  { selectedCard.type == "Eth holder" && (
                    <Button variant="solid"
                      color="primary"
                      className="text-center justify-center "
                      onClick={ () => checkETHBalance( selectedCard._id ) }>
                      Verify the account
                    </Button>
                  ) }

                  { selectedCard.type === "Connect multiple wallet" && (
                    [ ...Array( selectedCard.walletsToConnect ) ].map( ( _, index ) => (
                      <div key={ index }>
                        { localConnectedWallets[ index ] ? (
                          <div className="flex justify-between py-4">
                            <label htmlFor="">Connected your wallet { index + 1 }</label>
                            <Button
                              variant="flat"
                              color="primary"
                              className="text-center justify-center"
                              disabled
                            >
                              Connected to wallet { index + 1 }
                            </Button>
                          </div>
                        ) : (
                          <div className="flex justify-between py-4">
                            <label htmlFor="">Connect your wallet { index + 1 }</label>
                            <Button
                              onClick={ connectMultipleWallet }
                              variant="solid"
                              color="primary"
                              className="text-center justify-center"
                            >
                              Connect to wallet { index + 1 }
                            </Button>
                          </div>
                        ) }
                      </div>
                    ) )
                  ) }


                  {/* <Button
                    variant="solid"
                    color="danger"
                    className="m-4 text-white   "
                    onClick={ onClose }
                  >
                    Cancel
                  </Button> */}

                    { ( selectedCard.type === "Opinion Scale" || selectedCard.type === 'File upload' || selectedCard.type === 'Text' || selectedCard.type === 'Number' || selectedCard.type === 'URL'
                  ) &&
                    (
                      <Button
                        variant="solid"
                        color="primary"
                        className=" "
                        onClick={ handleSubmit }
                      >
                        Submit
                      </Button>
                    ) }
                </>
              ) }
            </div>
          </div>
        </div>
      </div >
    );
  };


export default QuestPage;