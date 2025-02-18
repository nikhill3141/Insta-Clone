import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Badge } from "./ui/badge";
import { Heart, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";

function Profile() {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const { userProfile,user} = useSelector((store) => store.auth);
  // console.log(userProfile);
  
  const isLogedIn = user?._id === userProfile?._id
  const isFollowing = true;
  const [activeTab,setActiveTab] = useState('post')
  const displaedPost = activeTab === 'post'? (userProfile.posts):(userProfile.bookmarks)
  const handleActiveTab = (tab) => {
    setActiveTab(tab)
  }
  return (
    <div className=" max-w-4xl  mx-auto items-center ">
      <div className="flex max-w-4xl justify-center mx-auto items-center pl-10">
        <div className="grid grid-cols-2  gap-10 my-10">
          <section className="flex justify-center ">
            <Avatar className="h-36 w-36">
              <AvatarImage src={userProfile.profilePicture} />
              <AvatarFallback>Nik</AvatarFallback>
            </Avatar>
          </section>
          <div className="">
            <div className="flex gap-3">
              <h1 className="text-2xl font-semibold">{userProfile.username}</h1>
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
                {`${userProfile.posts.length} Posts`}{" "}
              </p>
              <p className="font-semibold ">
                {`${userProfile.followers.length} followers`}{" "}
              </p>
              <p className="font-semibold ">
                {`${userProfile.following.length} followers`}{" "}
              </p>
            </div>
            <div>
              <p className="">{userProfile.bio}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex border-t-2 gap-10 max-w-4xl justify-center my-14 pl-52 mx-auto  ">
        <span className={`cursor-pointer  ${activeTab === 'post'? 'font-bold':''}`} onClick={()=>handleActiveTab('post')}>POST</span>
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
// import React, { useState } from 'react'
// import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
// import useGetUserProfile from '@/hooks/useGetUserProfile';
// import { Link, useParams } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { Button } from './ui/button';
// import { Badge } from './ui/badge';
// import { AtSign, Heart, MessageCircle } from 'lucide-react';

// const Profile = () => {
//   const params = useParams();
//   const userId = params.id;
//   useGetUserProfile(userId);
//   const [activeTab, setActiveTab] = useState('posts');

//   const { userProfile, user } = useSelector(store => store.auth);

//   const isLoggedInUserProfile = user?._id === userProfile?._id;
//   const isFollowing = false;

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//   }

//   const displayedPost = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks;

//   return (
//     <div className='flex max-w-5xl justify-center mx-auto pl-10'>
//       <div className='flex flex-col gap-20 p-8'>
//         <div className='grid grid-cols-2'>
//           <section className='flex items-center justify-center'>
//             <Avatar className='h-32 w-32'>
//               <AvatarImage src={userProfile?.profilePicture} alt="profilephoto" />
//               <AvatarFallback>CN</AvatarFallback>
//             </Avatar>
//           </section>
//           <section>
//             <div className='flex flex-col gap-5'>
//               <div className='flex items-center gap-2'>
//                 <span>{userProfile?.username}</span>
//                 {
//                   isLoggedInUserProfile ? (
//                     <>
//                       <Link to="/account/edit"><Button variant='secondary' className='hover:bg-gray-200 h-8'>Edit profile</Button></Link>
//                       <Button variant='secondary' className='hover:bg-gray-200 h-8'>View archive</Button>
//                       <Button variant='secondary' className='hover:bg-gray-200 h-8'>Ad tools</Button>
//                     </>
//                   ) : (
//                     isFollowing ? (
//                       <>
//                         <Button variant='secondary' className='h-8'>Unfollow</Button>
//                         <Button variant='secondary' className='h-8'>Message</Button>
//                       </>
//                     ) : (
//                       <Button className='bg-[#0095F6] hover:bg-[#3192d2] h-8'>Follow</Button>
//                     )
//                   )
//                 }
//               </div>
//               <div className='flex items-center gap-4'>
//                 <p><span className='font-semibold'>{userProfile?.posts.length} </span>posts</p>
//                 <p><span className='font-semibold'>{userProfile?.followers.length} </span>followers</p>
//                 <p><span className='font-semibold'>{userProfile?.following.length} </span>following</p>
//               </div>
//               <div className='flex flex-col gap-1'>
//                 <span className='font-semibold'>{userProfile?.bio || 'bio here...'}</span>
//                 <Badge className='w-fit' variant='secondary'><AtSign /> <span className='pl-1'>{userProfile?.username}</span> </Badge>
//                 <span>🤯Learn code with patel mernstack style</span>
//                 <span>🤯Turing code into fun</span>
//                 <span>🤯DM for collaboration</span>
//               </div>
//             </div>
//           </section>
//         </div>
//         <div className='border-t border-t-gray-200'>
//           <div className='flex items-center justify-center gap-10 text-sm'>
//             <span className={`py-3 cursor-pointer ${activeTab === 'posts' ? 'font-bold' : ''}`} onClick={() => handleTabChange('posts')}>
//               POSTS
//             </span>
//             <span className={`py-3 cursor-pointer ${activeTab === 'saved' ? 'font-bold' : ''}`} onClick={() => handleTabChange('saved')}>
//               SAVED
//             </span>
//             <span className='py-3 cursor-pointer'>REELS</span>
//             <span className='py-3 cursor-pointer'>TAGS</span>
//           </div>
//           <div className='grid grid-cols-3 gap-1'>
//             {
//               displayedPost?.map((post) => {
//                 return (
//                   <div key={post?._id} className='relative group cursor-pointer'>
//                     <img src={post.image} alt='postimage' className='rounded-sm my-2 w-full aspect-square object-cover' />
//                     <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
//                       <div className='flex items-center text-white space-x-4'>
//                         <button className='flex items-center gap-2 hover:text-gray-300'>
//                           <Heart />
//                           <span>{post?.likes.length}</span>
//                         </button>
//                         <button className='flex items-center gap-2 hover:text-gray-300'>
//                           <MessageCircle />
//                           <span>{post?.comments.length}</span>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 )
//               })
//             }
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Profile