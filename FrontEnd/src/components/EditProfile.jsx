import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { setAuthUser } from "@/redux/authSlice";

function EditProfile() {
  const imageRef = useRef();
  const {user} = useSelector(store=>store.auth)
  // const {user} = useSelector(store=>store.auth)
  const [loding,setLoding] = useState(false)
  const [input,setInput] = useState({
    profilePhoto:user.profilePicture,
    username:user.username,
    bio:user.bio,
    gender:user?.gender
    
  })
  const navigate = useNavigate()
  const dispatch = useDispatch()


  const fileChangesHandler = (e) => {
    const file = e.target.files?.[0]
    if(file){
      setInput({...input,profilePhoto:file})
    }
  }
  
  // const selectChangedValue = (value) => {
  //   setInput({...input,gender:value})
  // }
  

  const usernameChangeHandler = (e) => {
    setInput({...input,username:e.target.value})
  }
  const bioChangeHandler = (e) => {
    setInput({...input, bio:e.target.value})
  }

  const editProfileHandler = async () => {
    // console.log(input);
    const formData = new FormData()
      formData.append("bio",input.bio)
      formData.append("username",input.username)
      // formData.append("gender",input.gender)
      if(input.profilePhoto){
      formData.append("profilePhoto",input.profilePhoto)

      }
    try {
      setLoding(true)
      const res = await axios.post('https://insta-clone-made-by-nik.onrender.com/api/v1/user/profile/edit',formData,{
        headers:{
          'Content-Type':'multipart/form-data'
        },
        withCredentials:true
      })
      if(res.data.success){
        const updatedUserData = {
          ...user,
          bio:res.data.user?.bio,
          profilePicture:res.data.user?.profilePicture,
          // gender:res.data.juser.gender
        }
        dispatch(setAuthUser(updatedUserData))
        navigate(`/profile/${user?._id}`)
        toast.success(res.data.message)
      }
      
    } catch (error) {
      console.log(error);
      // toast.error(error.response.data.message)
    }
    finally{
      setLoding(false)
    }
  }

  return (
    <>
      <div className="flex flex-col justify-center ml-64 h-auto">
        <div className=" flex flex-col ml-52 mr-72 p-5 justify-center">
          <div className="flex max-w-4xl my-8 text-xl font-bold">
            Edit Profile
          </div>
          <div className="flex items-center justify-between rounded-3xl h-auto border w-full bg-gray-300 p-3 ">
            <div className="flex items-center gap-3">
              <Avatar className='size-20 ml-2 '>
                <AvatarImage src={user.profilePicture}/>
                <AvatarFallback>Nik</AvatarFallback>
              </Avatar>
              <div className="ml-5">
                <h1 className="text-xl font-bold" >{user.username}</h1>
                <p>{user.bio}</p>
              </div>
            </div>
            <input className="hidden" type="file" ref={imageRef} onChange={fileChangesHandler}/>
            <Button className='mr-3 bg-blue-600 hover:bg-blue-700'onClick={()=>imageRef?.current.click()}>Change Photo</Button>
          </div>
          <div className="mt-10">
            <span className="font-bold text-[21px] ml-2">username</span>
            <Textarea onChange={usernameChangeHandler} value={input.username} className='mt-2 text-gray-500 outline-none  '/>
          </div>
          <div className="mt-10">
            <span className="font-bold text-[21px] ml-2">Bio</span>
            <Textarea onChange={bioChangeHandler} value={input.bio} className='mt-2 text-gray-500 outline-none  '/>
          </div>
          <div className="mt-10 ">
            <span className="font-bold text-[21px] ml-2 mb-3 ">Gender</span>
            {/* <Select defaultValue={input.gender} onValueChange={selectChangedValue}>
              <SelectTrigger className='h-12 mt-2 p-5'>
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="others">Others</SelectItem>
              </SelectContent>
            </Select> */}
          </div>
          <div className="mt-10 flex justify-end p-3">
            {
              loding ? (
               
                <Button className='bg-blue-600 w-56 h-12 hover:bg-blue-700 ' onClick={editProfileHandler} >Please Wait 
                 <Loader2 className="animation-spin mr-2"/>
                </Button>

              ):(
            <Button className='bg-blue-600 w-56 h-12 hover:bg-blue-700 ' onClick={editProfileHandler} >Submit</Button>
              )
            }
          </div>
        </div>
      </div>
    </>
  );
}

export default EditProfile;
