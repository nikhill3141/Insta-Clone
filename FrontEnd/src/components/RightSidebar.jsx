import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";

function RightSidebar() {
  const { user } = useSelector((store) => store.auth);
  // console.log(user);
  
  return (
    <>
      <div className="w-fit my-10 pr-32">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${user?._id}`}>
            <Avatar>
              <AvatarImage>{user?.profilePicture}</AvatarImage>
              <AvatarFallback>Nik</AvatarFallback>
            </Avatar>
          </Link>

          <div>
            <Link to={`/profile/${user?._id}`}>
              <h1 className="font-semibold">{user?.username}</h1>
            </Link>
            <p className="text-gray-600">
              {user?.bio || "im the full stack devlopers"}
            </p>
          </div>
        </div>
        <div >
          <SuggestedUsers />
        </div>
      </div>
    </>
  );
}

export default RightSidebar;
