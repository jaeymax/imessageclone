import React,{useState, useEffect} from 'react'
import { Avatar } from '@material-ui/core'
import {db, auth} from '../firebase';
import {collection, addDoc, where, doc, getDocs, query, getDoc} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import {AppContext} from '../context/appContext';
import Spinner from './Spinner'

const User = ({name, about, photoUrl, id}) => {
  const {setShowUsers} = useContext(AppContext);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(()=>{
    getCurrentUserData();
    getUserData();
    
  },[])


  const createChat = async () =>{
      const chatsRef = collection(db, 'chats');
      const docRef = await addDoc(chatsRef, {
          isGroupChat:false,
          users:[auth.currentUser.uid, id],
          user1:{uid:currentUser.uid, photoUrl:currentUser.photoUrl, displayName:currentUser.displayName},
          user2:{uid:user.uid, photoUrl:user.photoUrl, displayName:user.displayName},
          lastMessage:null,
      })
      setShowUsers(false);
      navigate(`/chat/${docRef.id}`);
  }

  const getCurrentUserData  = async () =>{
    const userRef = doc(db, 'users', auth.currentUser.uid);
    const user = await getDoc(userRef);
    setCurrentUser(user.data());

  }

  const getUserData = async () =>{
    const userRef = doc(db, 'users', id);
    const user = await getDoc(userRef);
    setUser(user.data());
    setLoading(false);
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

  if(loading){
    return <Spinner/>
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