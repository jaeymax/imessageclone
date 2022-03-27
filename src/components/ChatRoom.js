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
  const [roomReciever, setRoomReciever] = React.useState({});
  const scrollRef = React.useRef(null);
  const [loading, setLoading] = React.useState(true);

  const sendMessage = async () => {
      if(!message)return;
      const messagesRef = collection(doc(db, 'chats', id), 'messages');
      const msg =  {
        from:auth.currentUser.uid,
        to: roomReciever.uid,
        read:false,
        body:message,
        timeStamp:serverTimestamp(),
      }
      setMessage('');
      await addDoc(messagesRef, msg);
      updateLastMessage(msg);
  }

  const updateLastMessage = async (message) =>{
     const chatRef = doc(db, 'chats', id);
     await updateDoc(chatRef, {lastMessage:message});
  }
  

  React.useEffect(()=>{
    getUser(); 
  },[])

  React.useEffect(()=>{
    const unsub = onSnapshot(query(collection(doc(db, 'chats', id), 'messages'), orderBy('timeStamp', 'asc')), querySnapShot => {
      setMessages(querySnapShot.docs.map((doc)=>(
        {
          id:doc.id,
          ...doc.data()
        }
      )))
     // scrollRef.current.scrollBottom;
    })
    return () => unsub();
  },[])


  const getUser = async () => {

    try{
        const chatRef = doc(db, 'chats', id);
        let chat = await getDoc(chatRef);
        chat = chat.data();
        const chatUsers = chat.users;
        const reciever = chatUsers[0] == auth.currentUser.uid?chatUsers[1]:chatUsers[0];

        const userRef = doc(db, 'users', reciever);
        let user = await getDoc(userRef);
        user = user.data();
        setRoomReciever(user);
       
        setLoading(false);
       
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
    <div className = 'chat__room__wrapper'>
    <StatusBar photoUrl={roomReciever.photoUrl} isOnline = {roomReciever.isOnline} roomName = {roomReciever.displayName} lastSeen = {roomReciever.lastSeen} />
    <div className='chat__room'>
        <div className='chat__messages' ref = {scrollRef} >
              {messages.map((message)=><ChatMessage chatId = {id} key = {message.id} id = {message.id} read ={message.read} message = {message.body} timeStamp = {message.timeStamp} to ={message.to} from = {message.from} />) }
            
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
    </div>
  )
}

export default ChatRoom