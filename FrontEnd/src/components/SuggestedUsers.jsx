import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

function SuggestedUsers() {
  const { suggestedUsers } = useSelector((store) => store.auth);
  console.log(suggestedUsers);

  return (
    <div className="my-10">
      <div className="flex justify-between">
        <h1 className="font-semibold text-gray-600">Suggested for you</h1>
        <span className="cursor-pointer font-medium text-blue-600">
          view all
        </span>
      </div>
      <div></div>
      <div>
        {suggestedUsers.map((user) => {
          return (
            <div
              key={user?._id}
              className=" flex items-center justify-between my-5 "
            >
              <div className="flex items-center ">
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
                  <p className="text-gray-600 tracking-tighter text-wrap">
                    {user?.bio || "im the full stack devlopers"}
                  </p>
                </div>
              </div>
              <span className="text-blue-600 text-sm cursor-pointer font-bold">Follow</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SuggestedUsers;
