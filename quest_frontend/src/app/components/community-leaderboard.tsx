import Image from 'next/image';
import React from 'react';

interface User
{
    id: number;
    image: string;
    username: string;
    badges: string[];
    xpPoints: number;
    famPoints: number;
}

const Leaderboard: React.FC = () =>
{
    const users: User[] = [
        { id: 1, image: 'https://i.pravatar.cc/150?img=1', username: 'CryptoKing', badges: [ '🥇', '🚀', '💎' ], xpPoints: 15000, famPoints: 7500 },
        { id: 2, image: 'https://i.pravatar.cc/150?img=2', username: 'BlockchainQueen', badges: [ '🥈', '🔥' ], xpPoints: 14200, famPoints: 7100 },
        { id: 3, image: 'https://i.pravatar.cc/150?img=3', username: 'NFTMaster', badges: [ '🥉', '🎨' ], xpPoints: 13800, famPoints: 6900 },
        { id: 4, image: 'https://i.pravatar.cc/150?img=4', username: 'DeFiGuru', badges: [ '📈', '💰' ], xpPoints: 12500, famPoints: 6250 },
        { id: 5, image: 'https://i.pravatar.cc/150?img=5', username: 'TokenWizard', badges: [ '✨', '🧙' ], xpPoints: 11000, famPoints: 5500 },
    ];

    return (
        <div className="max-w-2xl mx-auto p-4 bg-yellow-100 pt-10">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Community Leaderboard</h2>
            { users.map( ( user, index ) => (
                <div key={ user.id } className="flex items-center bg-white rounded-lg shadow-md p-4 mb-4 transition duration-300 hover:shadow-lg flex-wrap sm:flex-nowrap">
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-300 rounded-full mr-4 flex items-center justify-center font-bold text-xl text-gray-700">
                        { index + 1 }
                    </div>
                    <div className="flex-shrink-0 w-16 h-16 mr-4">
                        <img src={ user.image } alt={ user.username } className="w-full h-full object-cover rounded-full border-2 border-teal-500" />
                    </div>
                    <div className="flex-grow min-w-0">
                        <h3 className="font-bold text-lg text-gray-800">{ user.username }</h3>
                        <div className="flex mt-1 flex-wrap">
                            { user.badges.map( ( badge, index ) => (
                                <span key={ index } className="mr-1 text-xl" title={ badge }>
                                    { badge }
                                </span>
                            ) ) }
                        </div>
                    </div>
                    <div className="flex space-x-2 mt-4 sm:mt-0">
                        <div className="w-4 h-4 bg-yellow-300"></div>
                        <div className="w-4 h-4 bg-yellow-300"></div>
                        <div className="w-4 h-4 bg-yellow-300"></div>
                        <div className="w-4 h-4 bg-yellow-300"></div>
                    </div>
                    <div className="text-right mt-4 sm:mt-0 sm:ml-auto">
                        <div className="font-bold text-xl text-teal-600">{ user.xpPoints } XP</div>
                        <div className="text-sm text-gray-600">{ user.famPoints } Fam points</div>
                    </div>
                </div>
            ) ) }
            <button className="mt-4 w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition duration-300 font-bold">
                Export Excel for Addresses
            </button>
        </div>
    );
};

export default Leaderboard;
