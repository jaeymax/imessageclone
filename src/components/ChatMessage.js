import { doc, getDoc, updateDoc } from 'firebase/firestore'
import React,{useEffect, useState} from 'react'
import { auth, db } from '../firebase'
import Moment from 'react-moment';


const ChatMessage = ({message, chatId, id, read, from, to, timeStamp}) => {

  const [userName, setUserName] = useState(null);
  
  useEffect(async()=>{
       const docRef = doc(db, 'users', from);
       const docData = await getDoc(docRef);
       setUserName(docData.data().displayName);
     
  },[])

  useEffect(async()=>{
      const messageRef = doc(doc(db, 'chats', chatId), 'messages', id);
  
      if(!read && to === auth.currentUser.uid){
        console.log('yes')
        await updateDoc(messageRef, {read:true});
      }
  },[])
  

  return (
    <div className= {from === auth.currentUser.uid ?'chat__message sent':'chat__message recieved'} >
        <h5 className='chat__message__sender__name' >{userName}</h5>
        <p className = 'chat__message__body' >{message}</p>
        <span className='chat__message__timestamp' >
          <p><Moment format='h:mma' >{timeStamp?timeStamp.toDate():''}</Moment></p>
        </span>
    </div>
  )
}

export default ChatMessage