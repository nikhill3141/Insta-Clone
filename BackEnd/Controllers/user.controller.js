import { User } from "../Models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../Utils/dataUri.js";
import cloudinary from "../Utils/cloudinary.js";
import { Post } from "../Models/post.model.js";
import cookieParser from "cookie-parser";

//signin/register
export const register = async (req, res) => {
  try {
    console.log(req.body);

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(401).json({
        message: "Something is missing,Please check!",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({
        message: "Already hava an account,Please login!",
        success: false,
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      password: hashPassword,
    });
    return res.status(200).json({
      message: "Account created Successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        message: "Something is missing, Please check!",
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Incorrect Email ",
        success: false,
      });
    }
    const isPasswordMatch =  bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect  Password",
        success: false,
      });
    }
    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    // populate each post in the posts array

    const populatedPosts = await Post.find({
      _id: { $in: user.posts },
      author: user._id,
    }).populate({ path: "author", select: "username profilePicture" });

    // const populatedPosts = await Promise.all(
    //   user.posts.map(async (postId)=>{
    //     const post = await Post.findById(postId);
    //     if(post.author.equals(user._id)){
    //       return post;
    //     }
    //     return null;
    //   })
    // )
    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: populatedPosts,
    };

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `welcome back ${user.username}`,
        success: true,
        user,
      });
  } catch (error) {
    console.log(error);
  }
};

//logout
export const logout = async (_, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//Profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId).populate({path:'posts',createdAt:-1}).populate('bookmarks').select('-password');
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//edit Profile
export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;
    let cloudResponse;
    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "user not found",
        success: false,
      });
    }
    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    await user.save();

    return res.status(200).json({
      message: "profile updated",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

//User suggestions
export const getSuggestedUsers = async (req, res) => {
  try {
      const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
      if (!suggestedUsers) {
          return res.status(400).json({
              message: 'Currently do not have any users',
          })
      };
      return res.status(200).json({
          success: true,
          users: suggestedUsers
      })
  } catch (error) {
      console.log(error);
  }
};

//follow or unfollow
export const followOrUnfollow = async (req, res) => {
  try {
    const followKrneWala = req.id;
    const jiskoFollowKrunga = req.params.id;

    if (followKrneWala === jiskoFollowKrunga) {
      return res.status(400).json({
        message: "user not follow outselve",
        success: false,
      });
    }
    const user = await User.findById(followKrneWala);
    const targetUser = await User.findById(jiskoFollowKrunga);

    if (!user || !targetUser) {
      return res.status(400).json({
        message: "user not found",
        success: false,
      });
    }

    const isFollowing = await user.following.includes(jiskoFollowKrunga);
    if (isFollowing) {
      //Unfollow logic
      await Promise.all([
        User.updateOne(
          { _id: followKrneWala },
          { $pull: { following: jiskoFollowKrunga } }
        ),
        User.updateOne(
          { _id: jiskoFollowKrunga },
          { $pull: { followers: followKrneWala } }
        ),
      ]);
      return res
        .status(200)
        .json({ message: "Unfollowed successfully", success: true });
    } else {
      //follow logic
      await Promise.all([
        User.updateOne(
          { _id: followKrneWala },
          { $push: { following: jiskoFollowKrunga } }
        ),
        User.updateOne(
          { _id: jiskoFollowKrunga },
          { $push: { followers: followKrneWala } }
        ),
      ]);
      return res
        .status(200)
        .json({ message: "followed successfully", success: true });
    }
  } catch (error) {
    console.log(error);
  }
};
