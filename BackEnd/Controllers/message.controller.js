import { Conversation } from "../Models/conversation.model.js";
import { Message } from "../Models/message.model.js";
import { getReceiverSoketId, io } from "../socket/socket.js";

//for chatting
export const sendMessage = async (req, res)=>{
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const {textMessage:message} = req.body;
    console.log(message);
    

    let conversation = await Conversation.findOne({participants:{$all:[senderId,receiverId]}});

    // establish the conversation between two users
    if(!conversation){
      conversation = await Conversation.create({
        participants:[senderId, receiverId]
      })
    };
    const newMessage = await Message.create({
      senderId,
      receiverId,
      message
  });
  if(newMessage) conversation.messages.push(newMessage._id);
  
    await Promise.all([conversation.save(),newMessage.save()]);

    // implement socket io for real time data transfer
    const receiverSocketID = getReceiverSoketId(receiverId)
    if(receiverSocketID){
      io.to(receiverSocketID).emit('newMessage',newMessage)
    }

    return res.status(200).json({success:true,newMessage})
  } catch (error) {
    console.log(error);
    
  }
};

// get message
export const getMessage = async (req, res)=>{
  try {
    const senderId = req.id;
    const resiverId = req.params.id;
    const conversation = await Conversation.findOne({
      participants:{$all:[senderId,resiverId]}
    }).populate('messages');
    if(!conversation) return res.status(200).json({success:true,messages:[]});

    return res.status(200).json({success:true,messages:conversation?.messages})
    
  } catch (error) {
    console.log(error);
    
  }
}