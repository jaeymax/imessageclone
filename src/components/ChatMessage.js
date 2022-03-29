import { doc, getDoc, updateDoc } from 'firebase/firestore'
import React,{useEffect, useState} from 'react'
import { auth, db } from '../firebase'
import Moment from 'react-moment';


const ChatMessage = ({message, chatId, messageId, read, fromId, toId, name, timeStamp}) => {
  

  useEffect(async()=>{
      const chatRef = doc(db, 'chats', chatId);
      const messageRef = doc(doc(db, 'chats', chatId), 'messages', messageId);

      if(!read && toId === auth.currentUser.uid){
        await updateDoc(messageRef, {read:true});
        const chat = await getDoc(chatRef);
        if(chat.data().lastMessage.id == messageId){
          await updateDoc(chatRef, {lastMessage:{...chat.data().lastMessage, read:true}});
        }
      }
  },[])
  

  return (
    <div className= {fromId === auth.currentUser.uid ?'chat__message sent':'chat__message recieved'} >
        <h5 className='chat__message__sender__name' >{name}</h5>
        <p className = 'chat__message__body' >{message}</p>

        <span className='chat__message__timestamp' >
          {timeStamp?(<p><Moment format='h:mma' >{timeStamp.toDate()}</Moment></p>):('')}
        </span>
    </div>
  )
}

export default ChatMessage