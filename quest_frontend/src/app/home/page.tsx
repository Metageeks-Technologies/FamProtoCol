"use client";
import UserCard from "@/app/components/HomeCard/UserCard";
import EcoCate from "@/app/components/HomeCard/EcoCate";
import EducationCardList from "@/app/components/HomeCard/EducationCard";
import GrantsCard from "@/app/components/HomeCard/GrantsCard";
import AllCommunity from "@/app/components/HomeCard/AllCommunity";

const Homepage = () =>
{
  return (
    <div className="w-[90%] mx-auto">
      <UserCard />
      <EcoCate />
      <AllCommunity/>
      <EducationCardList  />
      <GrantsCard />
    </div>
  );
};

export default Homepage;

