import React from 'react'
import { Avatar } from '@material-ui/core'
import {db, auth} from '../firebase';
import {collection, addDoc, where, getDocs, query} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import {AppContext} from '../context/appContext';

const User = ({name, about, photoUrl, id}) => {
  const {setShowUsers} = useContext(AppContext);
  const navigate = useNavigate();

  const createChat = async () =>{
      const chatsRef = collection(db, 'chats');
      const docRef = await addDoc(chatsRef, {
          isGroupChat:false,
          users:[auth.currentUser.uid, id],
          lastMessage:null,
      })
      setShowUsers(false);
      navigate(`/chat/${docRef.id}`);
  }

  const createChatIfExist =async () =>{
      const q = query(collection(db, 'chats'), where('users', 'array-contains', auth.currentUser.uid));
      const querySnapShot = await getDocs(q);
    
      const chat = querySnapShot.docs.find(doc => doc.data().users.includes(id));
      if(chat){
        navigate(`/chat/${chat.id}`);
        setShowUsers(false);
      }
      else{
        createChat();
      }
  }

  return (
    <article className = 'user' onClick={createChatIfExist} >
      <Avatar src = {photoUrl} className = 'user__photo' />
      <div className='user__description' >
        <h4 className='chat__name' >{name}</h4>
        <p style = {{color:'gray'}} >{about}</p>
      </div>
    </article>
  )
}

export default User