import React from 'react';
import ChatMessage from './ChatMessage';
import {AttachFile, Mic, InsertEmoticon} from '@material-ui/icons';
import {IconButton} from "@material-ui/core";
import StatusBar from './StatusBar';
import {Send} from '@mui/icons-material'
import {useParams} from 'react-router-dom';
import {getDoc, doc, collection, orderBy, query, addDoc, serverTimestamp, updateDoc, onSnapshot} from 'firebase/firestore';
import {db, auth} from '../firebase';
import Spinner from './Spinner';

const ChatRoom = () => {

  const {id} = useParams();
  
  const [message, setMessage] = React.useState('');
  const [messages, setMessages] = React.useState([]);
  const [roomReciever, setRoomReciever] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState(null);
  const scrollRef = React.useRef(null);
  const [loading, setLoading] = React.useState(true);

  const sendMessage = async () => {
      if(!message)return;
      const messagesRef = collection(doc(db, 'chats', id), 'messages');
      const msg =  {
        from: {uid: currentUser.uid, displayName: currentUser.displayName},
        to: {uid:roomReciever.uid, displayName:roomReciever.displayName},
        read:false,
        body:message,
        timeStamp:serverTimestamp(),
      }
      setMessage('');
      const msgRef = await addDoc(messagesRef, msg);
      msg.id = msgRef.id;
      const chatRef = doc(db, 'chats', id);
      await updateDoc(chatRef, {lastMessage:msg});
      scrollRef.current.scrollIntoView({behaviour:'smooth'});
  }


  

  React.useEffect(()=>{
    getCurrentUser();
    getRoomReciever();
  },[])

  React.useEffect(()=>{
    const unsub = onSnapshot(query(collection(doc(db, 'chats', id), 'messages'), orderBy('timeStamp', 'asc')), querySnapShot => {
      setMessages(querySnapShot.docs.map((doc)=>(
        {
          id:doc.id,
          ...doc.data()
        }
      )));
    
    })
    return () => unsub();
  },[])




  const getRoomReciever = async () => {

    try{
       
      const chatRef = doc(db, 'chats', id);
      const chat = await getDoc(chatRef);
      const users = chat.data().users;
      const recieverId = users[0] === auth.currentUser.uid? users[1]: users[0]
      const userRef = doc(db, 'users', recieverId);
      const user = await getDoc(userRef);
      setRoomReciever(user.data());
      setLoading(false);
       
      }catch(error){
          console.log(error);
      }   
  }

  const getCurrentUser = async () =>{

    try{
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const user = await getDoc(userRef);
      setCurrentUser(user.data());

    }catch(error){
      console.log(error);
    }
  }


  if(loading){
    return (
      <Spinner/>
    )
  }

  return (
    <div className = 'chat__room'>
    <StatusBar photoUrl={roomReciever.photoUrl} isOnline = {roomReciever.isOnline} roomName = {roomReciever.displayName} lastSeen = {roomReciever.lastSeen} />
    
        <div className='chat__messages' ref = {scrollRef} >
              {messages.map((message)=><ChatMessage chatId = {id} key = {message.id} messageId = {message.id} read ={message.read} message = {message.body} timeStamp = {message.timeStamp} toId ={message.to.uid} name = {message.from.displayName} fromId = {message.from.uid} />) }
            
        </div>
      <div className='chats__bottom' >
          <input placeholder='Message' className='chats__input' value = {message} onChange = {(e)=>setMessage(e.target.value)} />
          <div className = 'chats__mike' >
            <IconButton onClick = {sendMessage} >
              {message?(<Send style = {{color:'white'}} />):(<Mic style = {{color:'white'}} />)}
              
            </IconButton>
          </div>
        </div>
    </div>
  )
}

export default ChatRoom