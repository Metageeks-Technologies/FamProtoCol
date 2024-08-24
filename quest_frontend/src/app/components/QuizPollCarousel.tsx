import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface QuizQuestion
{
    question: string;
    options: string[];
    correctAnswer: string;
}

interface PollQuestion
{
    question: string;
    options: string[];
}

interface CardData
{
    _id: string;
    type: string;
    quizzes?: QuizQuestion[];
    polls?: PollQuestion[];
}

interface QuizPollCarouselProps
{
    selectedCard: CardData;
    handleSubmit: ( answers: { [ key: string ]: string; } ) => void;
}

const QuizPollCarousel: React.FC<QuizPollCarouselProps> = ( { selectedCard, handleSubmit } ) =>
{
    const [ currentIndex, setCurrentIndex ] = useState( 0 );
    const [ answers, setAnswers ] = useState<{ [ key: string ]: string; }>( {} );
    const [ quizResults, setQuizResults ] = useState<{ [ key: string ]: boolean; }>( {} );
    const [ allAnswered, setAllAnswered ] = useState( false );

    const totalQuestions = selectedCard.type === "Poll" ? selectedCard.polls?.length : selectedCard.quizzes?.length;

    useEffect( () =>
    {
        const answeredCount = Object.keys( answers ).length;
        setAllAnswered( answeredCount === totalQuestions );
    }, [ answers, totalQuestions ] );

    const handleOptionSelect = ( index: number, value: string ) =>
    {
        setAnswers( prevAnswers => ( {
            ...prevAnswers,
            [ index ]: value
        } ) );

        if ( selectedCard.type === "Quiz" )
        {
            checkQuizAnswer( index, value );
        } else if ( currentIndex < ( totalQuestions || 0 ) - 1 )
        {
            setTimeout( () =>
            {
                setCurrentIndex( prevIndex => prevIndex + 1 );
            }, 1500 );
        }
    };

    const checkQuizAnswer = ( index: number, selectedAnswer: string ) =>
    {
        const currentQuiz = selectedCard.quizzes?.[ index ];
        if ( currentQuiz )
        {
            const isCorrect = selectedAnswer === currentQuiz.correctAnswer;
            setQuizResults( prevResults => ( {
                ...prevResults,
                [ index ]: isCorrect
            } ) );

            if ( isCorrect && currentIndex < ( totalQuestions || 0 ) - 1 )
            {
                setTimeout( () =>
                {
                    setCurrentIndex( prevIndex => prevIndex + 1 );
                }, 3000 );
            }
        }
    };

    const handleNext = () =>
    {
        if ( currentIndex < ( totalQuestions || 0 ) - 1 )
        {
            setCurrentIndex( prevIndex => prevIndex + 1 );
        }
    };

    const handlePrevious = () =>
    {
        if ( currentIndex > 0 )
        {
            setCurrentIndex( prevIndex => prevIndex - 1 );
        }
    };

    const handleSubmitAnswer = () =>
    {
        handleSubmit( answers );
    };

    const renderQuestion = () =>
    {
        const question = selectedCard.type === "Poll"
            ? selectedCard.polls?.[ currentIndex ]
            : selectedCard.quizzes?.[ currentIndex ];

        if ( !question ) return null;

        return (
            <motion.div
                initial={ { opacity: 0, y: 20 } }
                animate={ { opacity: 1, y: 0 } }
                exit={ { opacity: 0, y: -20 } }
                transition={ { duration: 0.3 } }
                className="bg-gradient-to-br from-[#2A2A2A] to-[#1E1E1E] p-6 rounded-xl shadow-lg"
            >
                <h2 className="text-2xl font-bold mb-4 text-white">
                    { selectedCard.type === "Poll" ? "Poll" : "Quiz" } Question { currentIndex + 1 }
                </h2>
                <p className="text-lg mb-6 text-gray-200">{ question.question }</p>
                <div className="grid grid-cols-1 gap-4">
                    { question.options.map( ( option, optionIndex ) => (
                        <motion.button
                            key={ optionIndex }
                            whileHover={ { scale: 1.02 } }
                            whileTap={ { scale: 0.98 } }
                            className={ `p-4 rounded-lg text-left transition-colors duration-200 ${ answers[ currentIndex ] === option
                                    ? selectedCard.type === "Quiz"
                                        ? quizResults[ currentIndex ]
                                            ? "bg-green-500 text-white"
                                            : "bg-red-500 text-white"
                                        : "bg-blue-500 text-white"
                                    : "bg-[#383838] text-gray-200 hover:bg-[#484848]"
                                }` }
                            onClick={ () => handleOptionSelect( currentIndex, option ) }
                        >
                            { option }
                        </motion.button>
                    ) ) }
                </div>
            </motion.div>
        );
    };

    return (
        <div className="space-y-6">
            { renderQuestion() }
            <div className="flex justify-between mt-6">
                <motion.button
                    whileHover={ { scale: 1.05 } }
                    whileTap={ { scale: 0.95 } }
                    className="bg-[#383838] text-white px-6 py-3 rounded-full hover:bg-[#484848] disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={ handlePrevious }
                    disabled={ currentIndex === 0 }
                >
                    Previous
                </motion.button>
                { currentIndex === ( totalQuestions || 0 ) - 1 ? (
                    <motion.button
                        whileHover={ { scale: 1.05 } }
                        whileTap={ { scale: 0.95 } }
                        className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={ handleSubmitAnswer }
                        disabled={ !allAnswered }
                    >
                        Submit
                    </motion.button>
                ) : (
                    <motion.button
                        whileHover={ { scale: 1.05 } }
                        whileTap={ { scale: 0.95 } }
                        className="bg-[#383838] text-white px-6 py-3 rounded-full hover:bg-[#484848] disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={ handleNext }
                        disabled={ currentIndex === ( totalQuestions || 0 ) - 1 }
                    >
                        Next
                    </motion.button>
                ) }
            </div>
        </div>
    );
};

export default QuizPollCarousel;