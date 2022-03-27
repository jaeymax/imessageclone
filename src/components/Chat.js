import React,{useEffect, useState} from 'react'
import { Avatar } from '@material-ui/core'
import {useNavigate} from 'react-router-dom'
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import Moment from 'react-moment'
import Spinner from './Spinner';


const Chat = ({timeStamp, reciever, lastMessage ,unreadMessages, id}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [chatName, setChatName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('')


  useEffect(()=>{
    getChatName();
  },[])

  const getChatName =async () =>{
      const userRef = doc(db, 'users', reciever);
      let userData = await getDoc(userRef);
      userData = userData.data();
      setChatName(userData.displayName);
      setPhotoUrl(userData.photoUrl)
      setLoading(false);

  }

  if(loading){
     return <Spinner/>
  }

  return (
    <article className='chat'  onClick = {()=>{navigate(`/chat/${id}`)}} >
        <Avatar src = {photoUrl} />
        <div className='chat__info' >
            <h4 className='chat__name'>
                {chatName}
            </h4>
            <p className='chat__lastMessage' >
                {lastMessage}
            </p>
        </div>
        <div className = 'chat__timestamp' >
            <span className = 'timestamp' >
                <p><Moment format='h:mma' >{timeStamp.toDate()}</Moment></p>
            </span>
            {unreadMessages == 0? '':<span className='notification'>{unreadMessages}</span>}
        </div>
    </article>
  )
}

export default Chat