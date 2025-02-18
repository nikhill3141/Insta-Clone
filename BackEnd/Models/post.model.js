// import mongoouse from 'mongoose';

// const postSchema = new mongoouse.Schema({
//   caption:{type:String, default:''},
//   image:{type:String, require:true},
//   likes:[{type:mongoouse.Schema.Types.ObjectId,ref:'User'}],
//   comments:[{type:mongoouse.Schema.Types.ObjectId,ref:'Comment'}],
//   author:{type:mongoouse.Schema.Types.ObjectId, ref:'User'}
// })

// export const Post = mongoouse.model('Post', postSchema);


import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
    caption:{type:String, default:''},
    image:{type:String, required:true},
    author:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    likes:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
    comments:[{type:mongoose.Schema.Types.ObjectId, ref:'Comment'}],
});
export const Post = mongoose.model('Post', postSchema);