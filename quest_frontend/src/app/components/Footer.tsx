import React from 'react';
import Image from 'next/image';

const Footer = () => {
  return (
    <div className="bg-black text-white pb-10 lg:px-20 sm:px-20 px-10">
    <div className="flex flex-wrap">
      <div className="mt-10 w-full md:w-full lg:w-1/2 pr-4">
      <div className='flex items-center gap-4 mb-4'>
        <div className="w-10 h-10">
          <img
            src='https://clusterprotocol2024.s3.amazonaws.com/website+logo/logo.png'
            alt='FamProtocol'
            className='w-full h-full object-cover'
          />
        </div>
        <div className='text-xl'>FamProtocol</div>

</div>
        <p className="text-gray-400">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
        </p>
      </div>
      <div className="mt-10 w-full md:w-full lg:w-1/2 grid grid-cols-2 sm:grid-cols-4 gap-6">
        <div className="mb-6 w-full sm:w-full">
          <h2 className="font-bold text-lg mb-3">Learn</h2>
          <ul className="space-y-6 text-gray-400">
            <li><a href="#" className="hover:text-gray-200">Blog</a></li>
            <li><a href="#" className="hover:text-gray-200">Documentation</a></li>
            <li><a href="#" className="hover:text-gray-200">API Docs</a></li>
          </ul>
        </div>
        <div className="mb-6 w-full sm:w-full">
          <h2 className="font-bold text-lg mb-3">Get Started</h2>
          <ul className="space-y-6 text-gray-400">
            <li><a href="#" className="hover:text-gray-200">Create an Account</a></li>
            <li><a href="#" className="hover:text-gray-200">Signup</a></li>
            <li><a href="#" className="hover:text-gray-200">Today Special</a></li>
          </ul>
        </div>
        <div className="mb-6 w-full sm:w-full">
          <h2 className="font-bold text-lg mb-3">Resources</h2>
          <ul className="space-y-6 text-gray-400">
            <li><a href="#" className="hover:text-gray-200">Career</a></li>
            <li><a href="#" className="hover:text-gray-200">Email us</a></li>
            <li><a href="#" className="hover:text-gray-200">Contact support</a></li>
          </ul>
        </div>
        <div className="mb-6 w-full sm:w-full">
          <h2 className="font-bold text-lg mb-3">Follow Us</h2>
          <ul className="space-y-6 text-gray-400">
            <li><a href="#" className="hover:text-gray-200">Twitter</a></li>
            <li><a href="#" className="hover:text-gray-200">LinkedIn</a></li>
            <li><a href="#" className="hover:text-gray-200">Facebook</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  
  
  

  );
};

export default Footer;
