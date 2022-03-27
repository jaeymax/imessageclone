import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { updateDoc, doc, serverTimestamp } from "firebase/firestore";

import More from '@material-ui/icons/MoreVertOutlined'
import Search from '@material-ui/icons/Search'
import IconButton from "@material-ui/core/IconButton";
import {DarkMode} from '@mui/icons-material';
import {WbSunny} from '@mui/icons-material';
import { AppContext } from "../context/appContext";

const Navbar = () => {

  const chatsRef = React.useRef(null);
  const statusRef = React.useRef(null);
  const callsRef = React.useRef(null);


  
  const {theme, toggleTheme, showMoreMenu, setShowMoreMenu} = useContext(AppContext);
  const navigate =  useNavigate();
  const handleSignOut = async () => {
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      isOnline: false,
      lastSeen: serverTimestamp(),
    });
    await signOut(auth);
    navigate('/login');
  };

  const handleChats = () =>{
    if(!chatsRef.current.classList.contains('active')){
      chatsRef.current.classList.add('active');
    }
    if(statusRef.current.classList.contains('active')){
      statusRef.current.classList.remove('active');
    }
    if(callsRef.current.classList.contains('active')){
      callsRef.current.classList.remove('active');
    }
  }

  const handleStatus = () =>{
    if(!statusRef.current.classList.contains('active')){
      statusRef.current.classList.add('active');
    }
    if(chatsRef.current.classList.contains('active')){
      chatsRef.current.classList.remove('active');
    }
    if(callsRef.current.classList.contains('active')){
      callsRef.current.classList.remove('active');
    }
  }

  const handleCalls = () =>{
    if(!callsRef.current.classList.contains('active')){
      callsRef.current.classList.add('active');
    }
    if(chatsRef.current.classList.contains('active')){
      chatsRef.current.classList.remove('active');
    }
    if(statusRef.current.classList.contains('active')){
      statusRef.current.classList.remove('active');
    }
  }


  return (
    <nav className="navbar" onClick={() => {
      if(showMoreMenu)setShowMoreMenu(false);
    }} >
      <div className = 'navbar__top' >
      <h3 className="navbar__name">
        <Link to={"/"}>Messenger </Link>
      </h3>
      <div className="navbar__options" >
    
          <IconButton onClick={()=>toggleTheme(theme)} >
            {theme === 'dark'?(<WbSunny className = 'moreIcon' />):(<DarkMode className = 'moreIcon' />)}
          </IconButton>

          <IconButton>
          <Search className = 'moreIcon' />    
          </IconButton>

          <IconButton onClick = {()=> setShowMoreMenu(true)} >
          <More className = 'moreIcon' />
          </IconButton>
          <div className = {showMoreMenu?'moreIcon__menu show':'moreIcon__menu hide'} >
            <li>New group</li>
            <li>
              <Link to = '/profile' style = {{color:'black'}} >
              Account
              </Link>
            </li>
            <li onClick={handleSignOut} >Logout</li>
          </div>

      </div>
      </div>

        <div className = 'navbar__bottom' >
            <h4 ref = {chatsRef} className = 'navbar__menu active' onClick={handleChats} style = {{display:'flex', alignItems:'center'}} >
                Chats <span style = {{marginLeft:'5px'}} >9</span>
            </h4>
            <h4 ref={statusRef} className = 'navbar__menu' onClick = {handleStatus} >
                Status
            </h4>
            <h4  ref={callsRef} className = 'navbar__menu' onClick = {handleCalls} >
                Calls
            </h4>
        </div>
    </nav>
  );
};

export default Navbar;
