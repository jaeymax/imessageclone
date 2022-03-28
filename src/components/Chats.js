import React,{useEffect, useState} from 'react'
import Chat from './Chat';
import { Message } from '@mui/icons-material';
import {useContext} from 'react'
import {AppContext} from '../context/appContext'
import {collection, doc, getDocs, onSnapshot, query, where} from 'firebase/firestore'
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
      console.log(chatsWithLastMessage);
      
      
      const  chts = []
      chatsWithLastMessage.forEach(async(docc,index)=>{
          const chatId = docc.id;
          const q = query(collection(doc(db, 'chats', chatId), 'messages'), where('read','==',false))
          const querySnapShot = await getDocs(q);
          const len = querySnapShot.docs.filter(doc => doc.data().to === auth.currentUser.uid).length;
          chts.push({...docc.data(), id:docc.id, reciever:docc.data().users[0] == auth.currentUser.uid? docc.data().users[1] : docc.data().users[0], unreadMessages:len})
          setChats(chts);
          
        })
        
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
          chats.map((chat) => <Chat key={chat.id} id = {chat.id} reciever = {chat.reciever}  lastMessage = {chat.lastMessage.body} timeStamp = {chat.lastMessage.timeStamp} unreadMessages = {chat.unreadMessages}  />)
        }
        <span className = 'mail' onClick = {()=>setShowUsers(true)} >
          < Message className = 'message' />
        </span>
    </div>
  
  )
}

export default Chats