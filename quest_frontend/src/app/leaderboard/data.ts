import React from "react";

export interface User
{
  
  image?: string;
  displayName?: string;
  rewards?: any;
  id: number;
  name: string;
  avatar: string;
  xps: number;
  level: number;
  fampoints: number;
  stars: number;
}

// Sample users data with realistic avatar URLs
const users: User[] = [
  {
    id: 1,
    name: 'John Doe',
    avatar: 'https://pics.craiyon.com/2023-11-12/iRznbtVdTBGaKNpMe9ZGFg.webp',
    xps: 5000,
    level: 5,
    fampoints: 250,
    stars: 4,
  },
  {
    id: 2,
    name: 'Jane Smith',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    xps: 4500,
    level: 4,
    fampoints: 200,
    stars: 3,
  },
  {
    id: 3,
    name: 'Michael Johnson',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    xps: 6000,
    level: 6,
    fampoints: 300,
    stars: 5,
  },
  {
    id: 4,
    name: 'Emily Brown',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    xps: 4000,
    level: 3,
    fampoints: 150,
    stars: 2,
  },
  {
    id: 5,
    name: 'David Lee',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    xps: 5500,
    level: 5,
    fampoints: 275,
    stars: 4,
  },
  {
    id: 6,
    name: 'Sophia Rodriguez',
    avatar: 'https://randomuser.me/api/portraits/women/6.jpg',
    xps: 4800,
    level: 4,
    fampoints: 210,
    stars: 3,
  },
  {
    id: 7,
    name: 'Matthew Wilson',
    avatar: 'https://randomuser.me/api/portraits/men/7.jpg',
    xps: 5200,
    level: 5,
    fampoints: 260,
    stars: 4,
  },
  {
    id: 8,
    name: 'Olivia Martinez',
    avatar: 'https://randomuser.me/api/portraits/women/8.jpg',
    xps: 4300,
    level: 3,
    fampoints: 180,
    stars: 2,
  },
  {
    id: 9,
    name: 'Ethan Taylor',
    avatar: 'https://randomuser.me/api/portraits/men/9.jpg',
    xps: 5800,
    level: 6,
    fampoints: 310,
    stars: 5,
  },
  {
    id: 10,
    name: 'Isabella Garcia',
    avatar: 'https://randomuser.me/api/portraits/women/10.jpg',
    xps: 4100,
    level: 3,
    fampoints: 170,
    stars: 2,
  },
];

// Define Column type
export interface Column {
  name: string;
  uid: keyof User ;
}

// Sample columns data
const columns: Column[] = [
  { name: 'Name', uid: 'name' },
  { name: 'Stars', uid: 'stars' },
  { name: 'Fampoints', uid: 'fampoints' },
  { name: 'XPS', uid: 'xps' },
];

export { users, columns };

