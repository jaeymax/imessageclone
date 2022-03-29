import React,{useEffect, useState} from 'react'
import { Avatar } from '@material-ui/core'
import {useNavigate} from 'react-router-dom'
import {doc, onSnapshot, collection} from 'firebase/firestore';
import { db,auth } from '../firebase';
import Moment from 'react-moment'


const Chat = ({timeStamp, photoUrl, name , lastMessage , id}) => {
  const navigate = useNavigate();
  const [lenOfUnreadMessages, setLenOfUnreadMessages] = useState(0);



  useEffect(()=>{
      const unsub = onSnapshot(collection(doc(db, 'chats', id), 'messages'), snapShot =>{
        
      const unreadMessages = snapShot.docs.filter(doc => doc.data().read == false);
      const unreadMsgByLoggedInUser = unreadMessages.filter(msg => msg.data().to.uid === auth.currentUser.uid).length;
      setLenOfUnreadMessages(unreadMsgByLoggedInUser);
    
      });

      return () => unsub;
  },[])

  

  return (
    <article className='chat'  onClick = {()=>{navigate(`/chat/${id}`)}} >
        <Avatar src = {photoUrl} />
        <div className='chat__info' >
            <h4 className='chat__name'>
                {name}
            </h4>
            <p className='chat__lastMessage' >
                {lastMessage}
            </p>
        </div>
        <div className = 'chat__timestamp' >
            <span className = 'timestamp' >
                <p><Moment format='h:mma' >{timeStamp.toDate()}</Moment></p>
            </span>
            {lenOfUnreadMessages > 0?(<span className='notification'>{lenOfUnreadMessages}</span>):('')}
            
        </div>
    </article>
  )
}

export default Chat