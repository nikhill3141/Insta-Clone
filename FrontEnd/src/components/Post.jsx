import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {

  Bookmark,
  BookmarkCheck,
  Heart,
  MessageCircle,
  MoreVertical,
  Send,
} from "lucide-react";
import { FaHeart } from "react-icons/fa";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import CommentDilog from "./CommentDilog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Badge } from "./ui/badge";

function Post({ post }) {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const [liked, SetLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLikeCount, setPostLikeCount] = useState(post.likes.length);
  const [comments, setComment] = useState(post.comments);
  const [bookmarked,setBookmarked] = useState()

  const handleChange = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };
  const handleLikeDislike = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `http://localhost:8000/api/v1/post/${post._id}/${action}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedLikes = liked ? postLikeCount - 1 : postLikeCount + 1;
        setPostLikeCount(updatedLikes);
        toast(res.data.message);
        SetLiked(!liked);
        //redux store mai post likes ko update karna padega\
        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id != user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const deletePostHandler = async (req, res) => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/post/delete/${post?._id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedPosts = posts.filter(
          (postItem) => postItem?._id !== post._id
        );
        toast.success(res.data.message);
        dispatch(setPosts(updatedPosts));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${post._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast(res.data.message);
        const updatedCommentPost = [...comments, res.data.comment];
        setComment(updatedCommentPost);

        const updatedPost = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                comments: updatedCommentPost,
              }
            : p
        );
        dispatch(setPosts(updatedPost));
        setText("");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handleBookmark = async () => {
    try {
    const res = await axios.get(`http://localhost:8000/api/v1/post/${post?._id}/bookmark`,{withCredentials:true})
      if(res.data.success){
        toast(res.data.message)
        res.data.type === 'saved' ? setBookmarked(true):setBookmarked(false)
      }
    } catch (error) {
      console.log(error);
      
    }
  }

  return (
    <div className="main-layout-post my-8 w-full max-w-sm mx-auto ">
      <div className="flex  items-center justify-between">
        {/* user heading */}
        <div className="user-section flex gap-2 items-center">
          <Avatar className="">
            <AvatarImage src={post.author.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1 className="font-bold">{post.author.username}</h1>
          {user?._id === post?.author._id && <Badge variant="secondary">Author</Badge>}
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreVertical className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center">
            <Button variant="ghost" className="w-fit text-[#ED4956] font-bold">
              unfollow
            </Button>
            <Button variant="ghost" className="w-fit">
              Add to favorites
            </Button>
            {user?._id === post?.author._id ? (
              <Button
                variant="ghost"
                className="w-fit font-bold"
                onClick={deletePostHandler}
              >
                {" "}
                Delete{" "}
              </Button>
            ) : (
              ""
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* post img */}
      <div className="img-section">
        <img
          className="my-2 aspect-square w-full rounded-sm object-cover"
          src={post.image}
          alt="post_img"
        />
      </div>

      {/* like comments Bookmark */}
      <div className="cammads flex justify-between my-2">
        <div className="flex gap-5 items-center  ">
          {liked ? (
            <FaHeart
              onClick={handleLikeDislike}
              className=" cursor-pointer text-red-600 size-6 ml-2"
            />
          ) : (
            <Heart
              onClick={handleLikeDislike}
              className=" cursor-pointer ml-2"
            />
          )}

          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className="hover:text-gray-600 cursor-pointer"
          />
          <Send className="hover:text-gray-600 cursor-pointer" />
        </div>
        {
          bookmarked ? (<BookmarkCheck onClick={handleBookmark} />) : (<Bookmark onClick={handleBookmark} className="hover:text-gray-600 cursor-pointer" />)
        }
        {/* <Bookmark onClick={handleBookmark} className="hover:text-gray-600 cursor-pointer" /> */}
      </div>
      <span className="font-medium mb-2 block">{postLikeCount} Likes</span>
      <p>
        <span className="font-medium mr-2">{post.author.username}</span>
        {post.caption}
      </p>
      <span
        onClick={() => {
          dispatch(setSelectedPost(post));
          setOpen(true);
        }}
        className="cursor-pointer text-gray-400"
      >
         {comments.length == 0 ? '' :`view all ${comments.length}comments`} 
      </span>
      {/* add comments */}
      <CommentDilog open={open} setOpen={setOpen} post={post} />
      <div className="flex">
        <input
          type="text"
          placeholder="Add the comment... "
          className="w-full outline-none text-sm"
          value={text}
          onChange={handleChange}
        />
        {text && (
          <span onClick={commentHandler} className="text-[#3BADF8] font-bold cursor-pointer">
            Post
          </span>
        )}
      </div>
    </div>
  );
}

export default Post;
