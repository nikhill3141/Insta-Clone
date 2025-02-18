import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  resiverId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  message:{
    type:String,
    require:true,
  }

})
export const Message = mongoose.model('Message',messageSchema);