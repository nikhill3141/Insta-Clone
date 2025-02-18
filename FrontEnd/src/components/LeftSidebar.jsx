import {
  HeartIcon,
  Home,
  HomeIcon,
  LogOut,
  LucideHome,
  MessageCircle,
  PlusCircle,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CreatePost from "./CreatePost";
import { setAuthUser } from "@/redux/authSlice";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";

function LeftSidebar() {
  const {likeNotification} = useSelector(store=>store.realTimeNotification)
  const navigate = useNavigate()
  const {user} = useSelector(store=>store.auth)
  const dispatch = useDispatch()
  const [open,setOpen] = useState(false)

  const barItems = [
    {
      icon: <Home />,
      text: "Home",
    },
    {
      icon: <TrendingUp />,
      text: "Explore",
    },
    {
      icon: <MessageCircle />,
      text: "Messages",
    },
    {
      icon: <HeartIcon />,
      text: "Notification",
    },
    {
      icon: <PlusCircle />,
      text: "Create",
    },
    {
      icon: (
        <Avatar className="size-9">
          <AvatarImage src={user?.profilePicture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    {
      icon: <LogOut/>,
      text: "Logout",
    },
  ];

  const handleLogout = async () => {
    try {
      const res = await axios.get('https://insta-clone-made-by-nik.onrender.com/api/v1/user/logout')

      if(res.data.success){
        dispatch(setAuthUser(null))
        navigate('/login')
        toast(res.data.message)
      }
      
    } catch (error) {
      // toast.error(error.response.data.message)
      console.log(error);
      
      
      
    }
  }


  const handleSidebar = (textType) => {
    if(textType === 'Logout'){
      handleLogout(); 
    }
     else if(textType === 'Create'){
      setOpen(true)
     }
     else if(textType === 'Profile'){
      navigate(`/profile/${user?._id}`)
     }
     else if(textType === 'Home'){
      navigate('/')
     }
     else if (textType === 'Messages'){
      navigate('/chat')
     }
  }

  return (
    <div className="fixed z-10 top-0 left-0 px-4 h-screen w-[16%] shadow-xl border-r border-gray-200 ">
      <div className="p-3 flex flex-col">
        <h1 className="font-bold ml-4 text-2xl mb-3 mt-2">Logo</h1>
      </div>
      <div>
        {barItems.map((item,index) => {
          return(
            <div key={index} onClick={()=>handleSidebar(item.text)} className="flex gap-3  mt-6 text-xl relative items-center ml-2 font-semi-bold p-2 hover:bg-gray-100 cursor-pointer rounded-lg mr-2 ">
              <div className="">
                {item.icon}
              </div>
              <span>
                {item.text}
              </span>
              {
                item.text === 'Notification'&& likeNotification.length > 0 && (
                  <Popover>
                    <PopoverTrigger asChild>
                        <Button size='icon' className='rounded-full bg-red-600 hover:bg-red-500 text-white h-5 w-5 absolute bottom-6 left-6'>{likeNotification.length}</Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div>
                        {
                          likeNotification.length === 0 ? (<p>No New Notification</p>):(
                            
                              likeNotification.map((notification)=>{
                                  return(
                                    <div key={notification.userId} className="flex items-center gap-2 my-4">
                                      <Avatar>
                                        <AvatarImage src={notification.userDetails?.profilePicture}/>
                                        <AvatarFallback>NIK</AvatarFallback>
                                      </Avatar>
                                      <p className="text-sm"><span className="font-bold">{notification.userDetails?.username}</span> like your post</p>

                                    </div>
                                  )
                              })
                            
 
                          )
                        }
                      </div>
                    </PopoverContent>

                  </Popover>
                )
              }

            </div>
          )
        })}
      </div>
      <CreatePost open={open} setOpen={setOpen}/>
    </div>
  );
}

export default LeftSidebar;
