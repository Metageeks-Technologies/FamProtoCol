"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTaskOptionsSuccess } from "@/redux/reducer/taskOptionSlice";
import { createTask } from "@/redux/reducer/taskSlice";
import { fetchUserData } from "@/redux/reducer/authSlice";
import { AppDispatch } from "@/redux/store";
import { notify } from "@/utils/notify";
import Image from "next/image";
import axios from "axios";
import Cookies from 'js-cookie';
import Link from "next/link";
import { DiscordJoin } from "@/app/components/discordPopup";
import { Button, Select, SelectItem } from "@nextui-org/react";

interface IQuiz
{
  question: string;
  options: string[];
  correctAnswer: string;
}

interface IPoll
{
  question: string;
  options: string[];
}

interface TaskOption
{
  name: string;
  icon: string;
  description: string;
  category: string;
  referral: string;
  visitLink?: string;
  quizzes?: IQuiz[];
  polls?: IPoll[];
  discord?: string;
  guild?: string;
  discordLink?: string;
  inviteLink?: string;
  uploadLink?: string;
  response?: string | number;
}

const AddTask = ( { params }: { params: { id: string; }; } ) =>
{
  const dispatch: AppDispatch = useDispatch();
  const [ isOpen, setIsOpen ] = useState( true );
  const [ selectedTask, setSelectedTask ] = useState<TaskOption | null>( null );
  const [ quizzes, setQuizzes ] = useState<Array<IQuiz>>( [
    { question: "", options: [ "", "", "", "" ], correctAnswer: "" },
  ] );
  const [ polls, setPolls ] = useState<Array<IPoll>>( [
    { question: "", options: [ "", "" ] },
  ] );
  const [ taskName, setTaskName ] = useState( "" );
  const [ taskDescription, setTaskDescription ] = useState( "" );
  const [ opinionQuestion, setOpinionQuestion ] = useState( "" );
  const [ rewards, setRewards ] = useState( { xp: 0, coins: 0, } );
  const [ fileType, setFileType ] = useState( "" );
  const [ inviteUrl, setInviteUrl ] = useState( '' );
  const [ success, setSuccess ] = useState( false );
  const [ showConnectButton, setShowConnectButton ] = useState( false );
  const [ modalView, setModalView ] = useState( false );
  const authToken = `Bearer ${ Cookies.get( 'authToken' ) }`;
  const [ wallets, setWallets ] = useState( 0 );


  const { taskOptions, categories } = useSelector( ( state: any ) => state.taskOption );
  const KolId = useSelector( ( state: any ) => state?.login?.user?._id );

  // console.log(taskOptions)

  useEffect( () =>
  {
    dispatch( fetchUserData() );
    dispatch( getTaskOptionsSuccess() );
  }, [ dispatch ] );

  const openTaskModal = ( task: TaskOption ) =>
  {
    setSelectedTask( task );
    if ( task.name === "Poll" )
    {
      setPolls( [ { question: "", options: [ "", "" ] } ] );
    } else if ( task.name === "Quiz" )
    {
      setQuizzes( [ { question: "", options: [ "", "", "", "" ], correctAnswer: "" } ] );
    }
  };
  const closeTaskModal = () =>
  {
    setSelectedTask( null );
    setInviteUrl( "" );
    setModalView( false );
    setRewards( { xp: 0, coins: 0, } );
    setTaskDescription( " " );
    setTaskName( ' ' );
    setFileType( '' );
    setPolls( [ { question: "", options: [ "", "" ] } ] );
    setQuizzes( [ { question: "", options: [ "", "", "", "" ], correctAnswer: '' } ] );
    setWallets( 0 );
  };



  const handleInputChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
  {
    if ( !selectedTask ) return;
    const value = e.target.value;
    const updatedField = {
      "Visit Link": { visitLink: value },
      "Discord": { discordLink: value, guild: value }
    }[ selectedTask.name ] || {};
    setSelectedTask( { ...selectedTask, ...updatedField } );
  };

  const handlediscordChange = ( inviteUrl: any, guildata: any ) =>
  {
    if ( !selectedTask ) return;
    const updatedField = {
      "Discord": { discordLink: inviteUrl, guild: guildata }
    }[ selectedTask.name ] || {};
    setSelectedTask( { ...selectedTask, ...updatedField } );
  };

  const handleAddTask = async () =>
  {
    if ( !selectedTask ) return;

    const baseTask = {
      type: selectedTask.name,
      category: selectedTask.category,
      questId: params.id,
      creator: KolId,
      taskName,
      taskDescription,
      rewards
    };

    const taskDataMap: any = {
      "Visit Link": { ...baseTask, visitLink: selectedTask.visitLink },
      "Discord": { ...baseTask, discordLink: selectedTask.discordLink, guild: selectedTask.guild },
      "Poll": {
        ...baseTask,
        polls: polls.map( poll => ( {
          question: poll.question,
          options: poll.options,
        } ) ),
      },
      "Quiz": {
        ...baseTask,
        quizzes: quizzes.map( quiz => ( {
          question: quiz.question,
          options: quiz.options,
          correctAnswer: quiz.correctAnswer,
        } ) ),
      },
      "File upload": {
        ...baseTask,
        uploadFileType: fileType
      },
      "Connect multiple wallet": {
        ...baseTask,
        walletsToConnect: wallets
      },
      "Opinion Scale": {
        ...baseTask,
        opinionQuestion: opinionQuestion
      }
    };

    const taskData = taskDataMap[ selectedTask.name ] || baseTask;
    console.log( 'taskdata:-', taskData );
    try
    {
      const response = await dispatch( createTask( taskData ) );
      console.log( 'response in adding the task:-', response );
      notify( "success", response?.payload?.msg || "Task created successfully" );
      closeTaskModal();
    } catch ( error ) 
    {
      console.error( "Error creating task:", error );
      notify( "error", "Error creating task" );
    }
  };

  const addNewQuiz = () =>
  {
    setQuizzes( [ ...quizzes, { question: "", options: [ "", "", "", "" ], correctAnswer: "" } ] );
  };

  const addNewPoll = () =>
  {
    setPolls( [ ...polls, { question: "", options: [ "", "" ] } ] );
  };

  const handleQuizQuestionChange = ( quizIndex: number, value: string ) =>
  {
    const newQuizzes = [ ...quizzes ];
    newQuizzes[ quizIndex ].question = value;
    setQuizzes( newQuizzes );
  };

  const handleQuizOptionChange = ( quizIndex: number, optionIndex: number, value: string ) =>
  {
    const newQuizzes = [ ...quizzes ];
    newQuizzes[ quizIndex ].options[ optionIndex ] = value;
    setQuizzes( newQuizzes );
  };

  const handleQuizCorrectAnswerChange = ( quizIndex: number, value: string ) =>
  {
    const newQuizzes = [ ...quizzes ];
    newQuizzes[ quizIndex ].correctAnswer = value;
    setQuizzes( newQuizzes );
  };

  const handlePollQuestionChange = ( pollIndex: number, value: string ) =>
  {
    const newPolls = [ ...polls ];
    newPolls[ pollIndex ].question = value;
    setPolls( newPolls );
  };

  const handlePollOptionChange = ( pollIndex: number, optionIndex: number, value: string ) =>
  {
    const newPolls = [ ...polls ];
    newPolls[ pollIndex ].options[ optionIndex ] = value;
    setPolls( newPolls );
  };

  const addPollOption = ( pollIndex: number ) =>
  {
    const newPolls = [ ...polls ];
    newPolls[ pollIndex ].options.push( "" );
    setPolls( newPolls );
  };

  const removePollOption = ( pollIndex: number, optionIndex: number ) =>
  {
    const newPolls = [ ...polls ];
    if ( newPolls[ pollIndex ].options.length > 2 )
    {
      newPolls[ pollIndex ].options.splice( optionIndex, 1 );
      setPolls( newPolls );
    }
  };


  const CheckDiscord = async ( inviteUrl: string ) =>
  {
    try
    {
      const encodedInviteUrl = encodeURIComponent( inviteUrl ); // encode the URL
      console.log("authToken", authToken);
      const response = await axios.post(
        `${ process.env.NEXT_PUBLIC_SERVER_URL }/auth/validate/${ encodedInviteUrl }`,
        {}, // assuming there is no body payload
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken,
          },
          withCredentials: true
        }
      );
      const data = response.data;
      const guildata = data.validLink.guilData;
      const checkguild = data.validLink.checkLink;
      // console.log(guildata)
      if ( checkguild )
      {
        setSuccess( true );
        handlediscordChange( inviteUrl, guildata );
        notify( "success", "Bot connected successfully" );
      } else
      {
        setShowConnectButton( true );
        setSuccess( false );
        setModalView( true );
        notify( "error", "Connect to the server to add a Discord task" );
      }
    } catch ( error: any )
    {
      setSuccess( false );
      setShowConnectButton( true );
      const errorMessage = error.response?.data?.message || "An error occurred";
      notify( "error", errorMessage );
    }
  };


  const handleChange = ( event: React.ChangeEvent<HTMLInputElement> ) =>
  {
    setInviteUrl( event.target.value );
  };

  const handleButtonClick = () =>
  {
    if ( inviteUrl )
    {

      CheckDiscord( inviteUrl );
    } else
    {
      notify( "error", "Please enter a valid URL." );
    }
  };


  return (
    <>


      { isOpen && (
        <div className=" inset-0 z-50 overflow-y-auto bg-black bg-opacity-75 flex items-center justify-center">
          <div className="relative p-4 w-full max-w-4xl">
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl">
              <div className="flex items-center justify-between p-5 border-b border-gray-700 bg-gray-800 rounded-t-3xl">
                <h3 className="text-2xl font-bold text-white">Find a task type</h3>
                <button
                  onClick={ () => window.history.back() }
                  className="text-gray-400 bg-transparent hover:bg-gray-700 hover:text-white rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </button>
              </div>


              <div className="flex flex-col md:flex-row">
                <div
                  className="p-4 md:p-5 flex flex-col gap-4 bg-[#141414] text-white w-full md:w-1/2" >
                  { categories.slice( 0, Math.ceil( categories.length / 2 ) ).map( ( category: string ) => (
                    <div key={ category }>
                      <div className="mx-4">
                        <h4 className="text-xl font-medium mb-2 text-gray-400 ">{ category }</h4>
                      </div>
                      <div className="space-y-2 mb-7 grid gap-4 sm:grid-cols-1">
                        { taskOptions
                          .filter( ( task: any ) => task.category === category )
                          .map( ( task: any, index: any ) => (
                            <div
                              key={ index }
                              className="flex items-center p-3 text-base font-medium rounded-3xl dark:text-white cursor-pointer hover:bg-[#272A2A] text-white shadow"
                              onClick={ () => openTaskModal( task ) }
                            >

                              <div className="flex items-center justify-center  mr-3">
                                <img
                                  src={ task.icon }
                                  alt={ task.name }
                                  // width={40}
                                  // height={40}
                                  className="flex-shrink-0 h-12 w-12 rounded-full object-cover"
                                />
                              </div>

                              <div className="flex-1 ">
                                <h3>{ task.name }</h3>
                                <div className="text-sm  ">
                                  <p className="text-gray-400"> { task.description } </p>
                                </div>
                              </div>
                            </div>

                          ) ) }
                      </div>
                    </div>
                  )
                  ) }
                </div>

                <div
                  className="p-4 md:p-5 flex flex-col gap-4 bg-[#141414] text-white w-full md:w-1/2" >
                  { categories.slice( Math.ceil( categories.length / 2 ) ).map( ( category: string ) => (
                    <div key={ category }>

                      <div className="mx-4">
                        <h4 className="text-xl font-medium mb-2 text-gray-400 ">{ category }</h4>
                      </div>

                      <div className="space-y-2 mb-7 grid gap-4 sm:grid-cols-1">
                        { taskOptions
                          .filter( ( task: any ) => task.category === category )
                          .map( ( task: any, index: any ) => (
                            <div
                              key={ index }
                              className="flex items-center p-3 text-base font-medium rounded-3xl dark:text-white cursor-pointer hover:bg-[#272A2A] text-white shadow"
                              onClick={ () => openTaskModal( task ) }
                            >
                              <div className="flex items-center justify-center  mr-3">
                                <img
                                  src={ task.icon }
                                  alt={ task.name }
                                  // width={40}
                                  // height={40}
                                  className="flex-shrink-0 h-12 w-12 rounded-full object-cover"
                                />
                              </div>

                              <div className="flex-1 ">
                                <h3>{ task.name }</h3>
                                <div className="text-sm  ">
                                  <p className="text-gray-400"> { task?.description } </p>
                                </div>
                              </div>
                            </div>

                          ) ) }
                      </div>
                    </div>
                  )
                  ) }
                </div>
              </div>
            </div>
          </div>
        </div>
      ) }

      { selectedTask && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75 flex items-center justify-center">
          <div className="relative p-4 w-full max-w-md max-h-[90vh] flex">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl text-white w-full flex flex-col">
              <div className="flex items-center justify-between p-5 border-b border-gray-700">
                <div className="flex items-center">
                  <img
                    src={ selectedTask.icon }
                    alt=""
                    className="h-12 w-12 object-cover rounded-full mr-4"
                  />
                  <h3 className="text-2xl font-bold">{ selectedTask.name }</h3>
                </div>
                <button
                  onClick={ closeTaskModal }
                  className="text-gray-400 bg-transparent hover:bg-gray-700 hover:text-white rounded-lg text-sm p-1.5"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </button>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto flex-grow">
                <p className="text-gray-300">{ selectedTask.description }</p>


                <div className="space-y-4">
                  <input
                    type="text"
                    className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
                    placeholder="Task Name"
                    onChange={ ( e ) => setTaskName( e.target.value ) }
                  />
                  <textarea
                    className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
                    placeholder="Task Description"
                    onChange={ ( e ) => setTaskDescription( e.target.value ) }
                    rows={ 4 }
                  />

                  { ( selectedTask.name === "Connect multiple wallet" ) &&
                    <div className="flex items-center mt-2">
                      <label
                        className="w-full p-3 border-r-1  rounded-l-lg bg-gray-700 text-white"
                      >
                        Total wallet to connect
                      </label>
                      <input
                        type="number"
                        min={ 1 }
                        max={ 10 }
                        value={ wallets }
                        className="w-3/4 p-3 bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:outline-none"
                        placeholder="Wallets to connect"
                        onChange={ ( e ) => setWallets( parseInt( e.target.value ) > 10 ? 10 : parseInt( e.target.value ) ) }
                      />
                    </div>
                  }


                  <label className="block text-gray-300 font-semibold mb-2">Rewards</label>
                  <div className="flex items-center mt-2">
                    <label
                      className="w-1/2 px-4 py-2 border rounded-l-lg bg-gray-800 text-white"
                    >
                      XP
                    </label>
                    <input
                      type="number"
                      value={ rewards.xp }
                      min={ 0 }
                      max={ 500 }
                      onChange={ ( e ) => setRewards( { ...rewards, xp: parseInt( e.target.value ) > 500 ? 500 : parseInt( e.target.value ) } ) }
                      placeholder="Value"
                      className="w-1/2 px-4 py-2 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-300 bg-gray-800 text-white"
                      required
                    />
                  </div>
                  <div className="flex items-center mt-2">
                    <label
                      className="w-1/2 px-4 py-2 border rounded-l-lg bg-gray-800 text-white"
                    >
                      Coins
                    </label>
                    <input
                      type="number"
                      min={ 0 }
                      max={ 100 }
                      value={ rewards.coins }
                      onChange={ ( e ) => setRewards( { ...rewards, coins: parseInt( e.target.value ) > 100 ? 100 : parseInt( e.target.value ) } ) }
                      placeholder="Value"
                      className="w-1/2 px-4 py-2 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-300 bg-gray-800 text-white"
                      required
                    />
                  </div>
                </div>

                {/* Task-specific inputs */ }
                { selectedTask.name === "Visit Link" && (
                  <input
                    type="url"
                    className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
                    placeholder="https://"
                    onChange={ handleInputChange }
                  />
                ) }

                { selectedTask.name === "Opinion Scale" && (
                  <div className="flex flex-col mt-4">
                    <label className="block text-gray-300 font-semibold mb-2">Opinion Question</label>
                    <textarea
                      className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus"
                      placeholder="Opinion Question"
                      onChange={ (e) => setOpinionQuestion(e.target.value) }
                    />
                  </div>
                ) }


                { selectedTask.name === "Discord" && (
                  <>
                    <input
                      type="url"
                      className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
                      placeholder="https://"
                      onChange={ handleChange }
                      value={ inviteUrl }
                    />

                    <div className="flex justify-between gap-4 items-center">
                      <Button

                        onClick={ handleButtonClick }
                      >
                        Check Discord Invite
                      </Button>
                      { modalView && ( <DiscordJoin setModalView={ setModalView } /> ) }
                    </div>

                  </>
                ) }

                { selectedTask.name === "Poll" && (
                  <div className="space-y-4">
                    { polls.map( ( poll, pollIndex ) => (
                      <div key={ pollIndex } className="bg-gray-800 p-4 rounded-lg space-y-3">
                        <h3 className="text-lg font-bold">Question { pollIndex + 1 }</h3>
                        <input
                          type="text"
                          className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
                          placeholder="Enter poll question"
                          value={ poll.question }
                          onChange={ ( e ) => handlePollQuestionChange( pollIndex, e.target.value ) }
                        />
                        { poll.options.map( ( option, optionIndex ) => (
                          <div key={ optionIndex } className="flex items-center space-x-2">
                            <input
                              type="text"
                              className="flex-grow p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
                              placeholder={ `Option ${ optionIndex + 1 }` }
                              value={ option }
                              onChange={ ( e ) => handlePollOptionChange( pollIndex, optionIndex, e.target.value ) }
                            />
                            { optionIndex > 1 && (
                              <button
                                onClick={ () => removePollOption( pollIndex, optionIndex ) }
                                className="p-2 bg-red-600 rounded-lg hover:bg-red-700 transition duration-300"
                              >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                              </button>
                            ) }
                          </div>
                        ) ) }
                        <button
                          onClick={ () => addPollOption( pollIndex ) }
                          className="mt-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300"
                        >
                          Add Option
                        </button>
                      </div>
                    ) ) }
                    <button
                      onClick={ addNewPoll }
                      className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
                    >
                      Add Poll Question
                    </button>
                  </div>
                ) }

                { selectedTask.name === "Quiz" && (
                  <div className="space-y-6">
                    { quizzes.map( ( quiz, quizIndex ) => (
                      <div key={ quizIndex } className="bg-gray-800 p-4 rounded-lg space-y-3">
                        <h3 className="text-lg font-bold">Question { quizIndex + 1 }</h3>
                        <input
                          type="text"
                          className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
                          placeholder="Enter quiz question"
                          value={ quiz.question }
                          onChange={ ( e ) => handleQuizQuestionChange( quizIndex, e.target.value ) }
                        />
                        { quiz.options.map( ( option, optionIndex ) => (
                          <input
                            key={ optionIndex }
                            type="text"
                            className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
                            placeholder={ `Choice ${ optionIndex + 1 }` }
                            value={ option }
                            onChange={ ( e ) => handleQuizOptionChange( quizIndex, optionIndex, e.target.value ) }
                          />
                        ) ) }
                        <input
                          type="text"
                          className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
                          placeholder="Correct answer"
                          value={ quiz.correctAnswer }
                          onChange={ ( e ) => handleQuizCorrectAnswerChange( quizIndex, e.target.value ) }
                        />
                      </div>
                    ) ) }
                    <button
                      onClick={ addNewQuiz }
                      className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
                    >
                      Add Quiz Question
                    </button>
                  </div>
                ) }

                { selectedTask.name === "File upload" && (

                  <Select

                    label="Select type of file you will upload"
                    placeholder="Select type of file you will upload"
                    onChange={ ( e ) => setFileType( e.target.value ) }
                    className="w-full border border-gray-800 rounded-lg focus:outline-none focus:ring-2 transition-colors duration-300 bg-black text-sm text-white"
                  >
                    <SelectItem className="bg-gray-600 text-white" key={ "image" } value="image">Image (.jpg, .png, .gif)</SelectItem>
                    <SelectItem className="bg-gray-600 text-white" key={ "audio" } value="audio">Audio (.mp3, .wav)</SelectItem>
                    <SelectItem className="bg-gray-600 text-white" key={ "video" } value="video">Video (.mp4, .mov)</SelectItem>
                    <SelectItem className="bg-gray-600 text-white" key={ "document" } value="document">Document (.pdf, .doc, .txt)</SelectItem>
                    <SelectItem className="bg-gray-600 text-white" key={ "spreedsheet" } value="spreadsheet">Spreadsheet (.xlsx, .csv)</SelectItem>
                    <SelectItem className="bg-gray-600 text-white" key={ "code" } value="code">Code File (.js, .py, .html)</SelectItem>
                    <SelectItem className="bg-gray-600 text-white" key={ "3d" } value="3d">3D Model (.obj, .fbx)</SelectItem>
                    <SelectItem className="bg-gray-600 text-white" key={ "archived" } value="archive">Archive (.zip, .rar)</SelectItem>
                  </Select>
                ) }

                { ( selectedTask.name === "Text" || selectedTask.name === "Number" || selectedTask.name === "URL" ) && (
                  <p className="text-center text-lg">
                    In this task, the user will respond with a { selectedTask.name.toLowerCase() }.
                  </p>
                ) }


                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300"
                    onClick={ closeTaskModal }
                  >
                    Cancel
                  </button>
                  <button
                    className={ `px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300 ${ selectedTask.name === "Discord" && !success ? 'opacity-50 cursor-not-allowed' : '' }` }
                    onClick={ handleAddTask }
                    disabled={ selectedTask.name === "Discord" && !success }
                  >
                    Add Task
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      ) }
    </>
  );
};


export default AddTask;



