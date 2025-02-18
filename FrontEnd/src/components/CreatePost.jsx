import { Dialog, DialogTitle } from "@radix-ui/react-dialog";
import React, { useRef, useState } from "react";
import { DialogContent, DialogHeader } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { readFileAsDataURI } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";

function CreatePost({ open, setOpen }) {
  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePrev, setImagePrev] = useState("");
  const [loading, setLoading] = useState(false);
  const {posts} = useSelector(store=>store.post)

  const dispatch = useDispatch()

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURI(file);
      setImagePrev(dataUrl);
    }
  };

  const createPostHandler = async (e) => {
    const formData = new FormData();
    formData.append("caption", caption);
    if(imagePrev) formData.append("image", file);
    try {
      setLoading(true)
      const res = await axios.post("http://localhost:8000/api/v1/post/addpost",formData,{
        headers:{
          'Content-Type':'multipart/form-data'
        },
        withCredentials:true
      });
      if(res.data.success){
        dispatch(setPosts([res.data.post, ...posts]));
        toast(res.data.message)
        setOpen(false)
      }
    } catch (error) {
      toast.error(error.response.data.message) 
    
      
      
    }finally{
      setLoading(false)
    }
  };

  const catptionChangeHandler = (e) => {
    const caption = e.target.value;
    if (caption) {
      setCaption(caption);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="outline-none flex flex-col items-center justify-center"
      >
        <DialogTitle className="text-xl font-bold">Create Post</DialogTitle>
        <div className="w-full  ">
          {/* <span className='text-gray-600 p-2  '>Bio here...</span> */}
          <Textarea
            className="focus-visible:ring-transparent border border-gray-600 "
            onChange={catptionChangeHandler}
            placeholder={"Write Caption..."}
          />
        </div>
        <input
          ref={imageRef}
          className="hidden"
          type="file"
          onChange={fileChangeHandler}
        />
        {imagePrev && (
          <div className="w-full h-64 flex items-center justify-center">
            <img
              src={imagePrev}
              className="w-full h-full object-cover rounded-md"
              alt="prv-img"
            />
          </div>
        )}
        <Button
          onClick={() => imageRef.current.click()}
          className="w-fit mx-auto bg-blue-600 hover:bg-blue-700"
        >
          Seclect from computer
        </Button>
        {imagePrev &&
          (loading ? (
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              {" "}
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait...{" "}
            </Button>
          ) : (
            <Button
              onClick={createPostHandler}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Post
            </Button>
          ))}
      </DialogContent>
    </Dialog>
  );
}

export default CreatePost;
