import React from 'react';
import Image from 'next/image';
interface NavigationItem {
  title: string;
  items: string[];
}

const navigationData: NavigationItem[] = [
  {
    title: 'Developers',
    items: ['Documentation', 'Github']
  },
  {
    title: 'About',
    items: ['Careers', 'Community']
  }
];
const Footer = () => {
  return (
    <div className="text-white p-4 footer-bg">
   
  </div>
  );
};

export default Footer;

interface NavigationSectionProps {
  items: string[];
  align: 'start' | 'end';
}

const NavigationSection: React.FC<NavigationSectionProps> = ({ items, align }) => {
  return (
    <div className={`flex flex-col justify-center items-${align} self-stretch my-auto`}>
      {items.map((item, index) => (
        <div key={index} className={index > 0 ? 'mt-1.5' : ''}>{item}</div>
      ))}
    </div>
  );
};
