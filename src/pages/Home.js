import React from 'react'
import Chats from '../components/Chats';
import Navbar from '../components/Navbar';
import UsersBar from '../components/UsersBar';
import { useContext } from 'react';
import {AppContext} from '../context/appContext'; 
import Users from '../components/Users';
import { collection, getDocs, query} from 'firebase/firestore';
import { db, auth } from '../firebase';



const Home = () => {
  const {showUsers} = useContext(AppContext);
  const [users, setUsers] = React.useState([]);
  
  


  React.useEffect(()=>{
    getUsers();
  },[])

  

  const getUsers = async () =>{
    const usersRef = collection(db, 'users');
    const q = query(usersRef);
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc)=>{
    if(doc.data().uid !== auth.currentUser.uid){
      users.push(doc.data())
    }
    })
  }

  

  return (
    <div className='home' >
      <Navbar/>
        <Chats/>
        <div className={`Users ${showUsers? 'showUsers':''}`} >
          <UsersBar usersCount ={users.length} />
          <Users users = {users}/>
        </div>
    </div>
  )
}

export default Home