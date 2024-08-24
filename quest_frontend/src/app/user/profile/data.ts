import React from "react";

type Friend = {
  id: number;
  name: string;
  role: string;
  team: string;
  status: string;
  age: string;
  avatar: string;
  level: number;
  fampoints: number;
  xps: number;
  stars: number;
  email: string;
};



const friends = [
  {
    id: 1,
    name: "Tony Reichert",
    role: "CEO",
    team: "Management",
    status: "active",
    age: "29",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    level: 5,
    fampoints: 250,
    xps: 5000,
    stars: 4,
    email: "tony.reichert@example.com",
  },
  {
    id: 2,
    name: "Maria Sanchez",
    role: "Developer",
    team: "Engineering",
    status: "active",
    age: "25",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024e",
    level: 3,
    fampoints: 150,
    xps: 3000,
    stars: 3,
    email: "maria.sanchez@example.com",
  },
  {
    id: 3,
    name: "John Doe",
    role: "Manager",
    team: "Operations",
    status: "inactive",
    age: "32",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024f",
    level: 8,
    fampoints: 200,
    xps: 4000,
    stars: 5,
    email: "john.doe@example.com",
  },
  {
    id: 4,
    name: "Tony Reichert",
    role: "CEO",
    team: "Management",
    status: "active",
    age: "29",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    level: 5,
    fampoints: 250,
    xps: 5000,
    stars: 4,
    email: "tony.reichert@example.com",
  },
  {
    id: 5,
    name: "Maria Sanchez",
    role: "Developer",
    team: "Engineering",
    status: "active",
    age: "25",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024e",
    level: 3,
    fampoints: 150,
    xps: 3000,
    stars: 3,
    email: "maria.sanchez@example.com",
  },
  {
    id: 6,
    name: "John Doe",
    role: "Manager",
    team: "Operations",
    status: "inactive",
    age: "32",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024f",
    level: 8,
    fampoints: 200,
    xps: 4000,
    stars: 5,
    email: "john.doe@example.com",
  },
  {
    id: 7,
    name: "Emily Johnson",
    role: "Designer",
    team: "Creative",
    status: "active",
    age: "27",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e290260250",
    level: 6,
    fampoints: 180,
    xps: 3500,
    stars: 4,
    email: "emily.johnson@example.com",
  },
];

export type { Friend };
export {  friends };
