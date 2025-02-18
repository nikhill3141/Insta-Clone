import { setPosts, setSelectedPost } from "@/redux/postSlice.js";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllPost = () => {
  const dispatch = useDispatch();
  useEffect(() => {
   
      const fetchAllPost = async () => {
       
        try {
          const res = await axios.get("https://insta-clone-made-by-nik.onrender.com/api/v1/post/all", {
            withCredentials: true,
          });
  
          if (res.data.success) {
            // console.log(res.data.posts);
            dispatch(setPosts(res.data.posts));
           
          }
          
        } catch (error) {
          console.log(error);
          
        } 
        
      }
      fetchAllPost();
    
  }, [ ]);
};

export default useGetAllPost;
