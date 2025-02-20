import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Heart, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";


const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  
  const { userProfile,user} = useSelector(store => store.auth);
  // console.log(userProfile)
  
  const isLogedIn = user?._id === userProfile?._id
  const isFollowing = true;
  const [activeTab,setActiveTab] = useState("posts")

  const handleActiveTab = (tab) => {
    setActiveTab(tab)
  }

  const displaedPost = activeTab === 'posts'? userProfile?.posts : userProfile?.bookmarks

  return (
    <div className=" max-w-4xl  mx-auto items-center ">
      <div className="flex max-w-4xl justify-center mx-auto items-center pl-10">
        <div className="grid grid-cols-2  gap-10 my-10">
          <section className="flex justify-center ">
            <Avatar className="h-36 w-36">
              <AvatarImage src={userProfile?.profilePicture} />
              <AvatarFallback>Nik</AvatarFallback>
            </Avatar>
          </section>
          <div className="">
            <div className="flex gap-3">
              <h1 className="text-2xl font-semibold">{userProfile?.username}</h1>
              {isLogedIn ? (
                <Link to={`/edit`} className=""><Button className="bg-gray-500 hover:bg-gray-600 text-white rounded mx-3 font-semibold">
                  Edit Profile
                </Button>
                </Link>
              ) : isFollowing ? (
                <>
                <button className="bg-gray-400 hover:bg-gray-500 text-white rounded w-20  font-semibold">
                  Unfollow
                </button>
                <button className="bg-gray-400 hover:bg-gray-500 text-white rounded w-20 font-semibold">
                  Message
                </button>
                </>
              ) : (
                <button className="bg-blue-600 hover:bg-blue-700 text-white rounded w-20 mx-5 font-semibold">
                  Follow
                </button>
              )}
            </div>
            <div className="flex gap-5 my-3">
              <p className="font-semibold ">
                {`${userProfile?.posts.length} Posts`}{" "}
              </p>
              <p className="font-semibold ">
                {`${userProfile?.followers.length} followers`}{" "}
              </p>
              <p className="font-semibold ">
                {`${userProfile?.following.length} followers`}{" "}
              </p>
            </div>
            <div>
              <p className="">{userProfile?.bio}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex border-t-2 gap-10 max-w-4xl justify-center my-14 pl-52 mx-auto  ">
        <span className={`cursor-pointer  ${activeTab === 'posts'? 'font-bold':''}`} onClick={()=>handleActiveTab('posts')}>POST</span>
        <span className={`cursor-pointer  ${activeTab === 'saved'? 'font-bold':''}`} onClick={()=>handleActiveTab('saved')}>SAVED</span>
        <span className={`cursor-pointer  ${activeTab === 'reel'? 'font-bold':''}`} onClick={()=>handleActiveTab('reel')}>REELS</span>
        <span className={`cursor-pointer  ${activeTab === 'taged'? 'font-bold':''}`} onClick={()=>handleActiveTab('taged')}>TAGED</span>
      </div>
      <div className="grid grid-cols-3 gap-2 ">
        {
          displaedPost.map((post)=>{
            return(
              <div key={post._id} className="cursor-pointer group relative">
                <img src={post.image} alt="postimg" className="rounded aspect-square object-cover w-full" />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center text-white space-x-4">
                    <button className="flex items-center gap-2"><Heart/><span>{post?.likes.length}</span></button>
                    <button className="flex items-center gap-2"><MessageCircle/><span>{post?.comments.length}</span></button>
                  </div>
                </div>
              </div>
            ) 
          })
        }
      </div>
      
    </div>
  );
}

export default Profile;


