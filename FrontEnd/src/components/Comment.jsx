import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

function Comment({comment}) {
  return (
    <div className=''>
      <div className='flex items-center gap-3 mb-5'>
        <Avatar>
          <AvatarImage src={comment?.author?.profilePicture}/>
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h1 className='font-bold'>{comment?.author?.username}</h1>
        <span>{comment?.text}</span>
      </div>
    </div>
  )
}

export default Comment