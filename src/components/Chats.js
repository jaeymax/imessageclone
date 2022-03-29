import React,{useEffect, useState} from 'react'
import Chat from './Chat';
import { Message } from '@mui/icons-material';
import {useContext} from 'react'
import {AppContext} from '../context/appContext'
import {collection, onSnapshot, query, where} from 'firebase/firestore'
import { auth, db } from '../firebase';
import Spinner from './Spinner';



const Chats = () => {
  const {showMoreMenu, setShowMoreMenu, setShowUsers} = useContext(AppContext);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
 

  useEffect(()=>{
    const unsub = onSnapshot(query(collection(db, 'chats'), where('users', 'array-contains',auth.currentUser.uid)), snapShot=>{
      //Get only the chats with a last message
      const chatsWithLastMessage = snapShot.docs.filter(doc=>doc.data().lastMessage != null);
      
      
      setChats(chatsWithLastMessage.map(chat => ({...chat.data(), id:chat.id, reciever: auth.currentUser.uid === chat.data().user1.uid? chat.data().user2 : chat.data().user1})))
        
      setLoading(false);
      
          
    })
    return () => unsub();
  },[])

  



  if(loading){
    return (
     <Spinner/>
    )
  }
  


  return (
    
    <div className='chats' onClick={()=>{if(showMoreMenu)setShowMoreMenu(false)}}>
        {
          chats.map((chat) => <Chat key={chat.id} id = {chat.id} name = {chat.reciever.displayName} photoUrl = {chat.reciever.photoUrl}  lastMessage = {chat.lastMessage.body} timeStamp = {chat.lastMessage.timeStamp} />)
        }
        <span className = 'mail' onClick = {()=>setShowUsers(true)} >
          < Message className = 'message' />
        </span>
    </div>
  
  )
}

export default Chats