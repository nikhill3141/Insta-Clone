import sharp from "sharp";
import { Post } from "../Models/post.model.js";
import { User } from "../Models/user.model.js";
import { Comment } from "../Models/comment.model.js";
import cloudinary from "../Utils/cloudinary.js";
import { getReceiverSoketId, io } from "../socket/socket.js";

//post creation
export const addNewPost = async (req, res) => {
  try {
      const { caption } = req.body;
      const image = req.file;
      const authorId = req.id;

      if (!image) return res.status(400).json({ message: 'Image required' });

      // image upload 
      const optimizedImageBuffer = await sharp(image.buffer)
          .resize({ width: 800, height: 800, fit: 'inside' })
          .toFormat('jpeg', { quality: 80 })
          .toBuffer();

      // buffer to data uri
      const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
      const cloudResponse = await cloudinary.uploader.upload(fileUri);
      const post = await Post.create({
          caption,
          image: cloudResponse.secure_url,
          author: authorId
      });
      const user = await User.findById(authorId);
      if (user) {
          user.posts.push(post._id);
          await user.save();
      }

      await post.populate({ path: 'author', select: '-password' });

      return res.status(201).json({
          message: 'New post added',
          post,
          success: true,
      })

  } catch (error) {
      console.log(error);
  }
}


//get all post
export const getAllPost = async (req, res) => {
  try {
      
      const posts = await Post.find().sort({ createdAt: -1 })
          .populate({ path: 'author', select: 'username profilePicture' })
          .populate({
              path: 'comments',
              sort: { createdAt: -1 },
              populate: {
                  path: 'author',
                  select: 'username profilePicture'
              }
          });
          
          
      return res.status(200).json({
          posts,
          success: true
      })
  } catch (error) {
      console.log(error);
  }
};

//get users posts
export const getUserPosts = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username,profilePicture",
      })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username, password",
        },
      });

    return res.status(200).json({
      posts: Array.isArray(posts) ? posts : [] ,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//like posts
export const likePost = async (req, res) => {
  try {
    const likeKarneWaleKiId = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "post not found" });

    await post.updateOne({ $addToSet: { likes: likeKarneWaleKiId } });
    await post.save();

    //implementing the socket io for the real time noti for like (hold)
    const user = await User.findById(likeKarneWaleKiId).select('username profilePicture')
    const postOwnerId = post.author.toString()
    if(postOwnerId !== likeKarneWaleKiId){
      const notification = {
        type:'like',
        userId:likeKarneWaleKiId,
        userDetails:user,
        postId,
        message:"your Post was liked"
      }
      const postOwnerSocketId = getReceiverSoketId(postOwnerId)
      io.to(postOwnerSocketId).emit('notification',notification)
    }

    return res.status(200).json({ message: "Post liked", success: true });
  } catch (error) {
    console.log(error);
  }
};

//dislike post
export const disLike = async (req, res) => {
  try {
    const likeKarneWaleKiId = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if(!post) return res.status(401).json({message:'post not found'});

    await post.updateOne({$pull:{likes:likeKarneWaleKiId}});
    await post.save();

    //socket io implementation for dislike
    const user = await User.findById(likeKarneWaleKiId).select('username profilePicture')
    const postOwnerId = post.author.toString()
    if(postOwnerId !== likeKarneWaleKiId){
      const notification = {
        type:'dislike',
        userId:likeKarneWaleKiId,
        userDetails:user,
        postId,
        message:"your Post was liked"
      }
      const postOwnerSocketId = getReceiverSoketId(postOwnerId)
      io.to(postOwnerSocketId).emit('notification',notification)
    }

    return res.status(200).json({
      message:'Post dissliked',
      success:true
    })
    
  } catch (error) {
    console.log(error);
    
  }
};

//comments
export const addComment = async (req, res)=>{
  try {
    const postId = req.params.id;
    const commentKarneWaleKiId = req.id;

    const {text} = req.body;

    const post = await Post.findById(postId);
    if(!text) return res.status(400).json({message:'text is required',success:false});

    const comment = await Comment.create({
      text,
      author:commentKarneWaleKiId,
      post:postId
    })

    await comment.populate({
      path:'author',
      select:'username profilePicture'
    });

    post.comments.push(comment._id)
    await post.save();

    return res.status(200).json({message:'comment added',success:true,comment})
    
  } catch (error) {
    console.log(error);
    
  }
}

//indivisual post comments
export const getCommentsOfPost = async (req, res)=>{
  try {
    const postId = req.params.id;
    const comments = await Comment.find({post:postId})
    await comments.populate({
      path:'author',
      select:'username profilePicture'
    });

    if(!comments) return res.status(404).json({message:'No comments', success:false});

    return res.status(200).json({success:true,comments});
     
  } catch (error) {
    console.log(error);
    
  }
}

//delete post 
export const deletePost = async (req, res)=>{
  try {

    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if(!post) return res.status(404).json({messgae:'post not found', success:true});

    //check the owner of the post is login 
    if(post.author.toString() !== authorId) return res.status(403).json({message:'unauthorized user'});

    //delete post 
    await Post.findByIdAndDelete(postId);

    //remove post id from the user post arr
    let user = await User.findById(authorId);
    user.posts = user.posts.filter(id => id.toString() !== postId);
    await user.save();

    //delete associtated commenst 
    await Comment.deleteMany({post:postId});

    return res.status(200).json({message:'post deleted',success:true});
    
  } catch (error) {
    console.log(error);
    
  }
}

//Bookmark post 
export const bookMarkPost = async (req, res)=>{
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);

    if(!post) return res.status(400).json({message:'post not fond',success:false});

    const user = await User.findById(authorId);
    if(user.bookmarks.includes(post._id)){
      //so already bookmarked (remove logic)
      await user.updateOne({$pull:{bookmarks:post._id}})
      await user.save();
      return res.status(200).json({type:'unsaved',message:'post remove form bookmark',success:true});

    }else{
      //bookmark logic
      await user.updateOne({$addToSet:{bookmarks:post._id}})
      await user.save();
      return res.status(200).json({type:'saved',message:'post bookmarked',success:true});
    }

  } catch (error) {
    console.log(error);
    
  }
}