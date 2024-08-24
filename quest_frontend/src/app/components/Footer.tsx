import React from 'react';
import Image from 'next/image';

const Footer = () => {
  return (
    <div className="bg-black text-white pb-10 lg:px-20 sm:px-20 px-10">
    <div className="flex flex-wrap">
      <div className="mt-10 w-full md:w-full lg:w-1/2 pr-4">
        <div className="mb-4">
          <img
            src='https://s3-alpha-sig.figma.com/img/4512/b4ae/e762c2983c04d88202e359621154bb15?Expires=1721001600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=OiPWhLmECDGKHGbJf5PRRFaKXBpklLIRggKSIooahgqBpMPLhfvkfdieq4tWITNiASO70HIpVcMhWUHWaHwxufDuV-CgL4Qmc7HERzB9GU5M02pvnZCrJocx3oQ3UhnZfqwos6DhhuTBWlA2OrOm8qzjpELwnfxA7z7FCTT39XM4OyklyewONudq7zwPd6Tk6tXAEIJxJTsSeYboDA5Am74xmCc2an2a7kbTXfCEzdS553PjwVyX1-hhESunB8WDuCB8bpWu5JaET-rD76hJ-BNh6LPvSBFrpSJLQ8fUY6earwCf4b-dkE5s78cC9yXpgEkLGAmlMh3iqUndUo8xSA__'
            alt='Flowbite Logo'
            className='h-12 w-32'
          />
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
