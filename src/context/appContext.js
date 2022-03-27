import React,{createContext, useState, useEffect} from 'react'
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from '../firebase';

export const AppContext = createContext();

const AppProvider = ({children}) => {

  let mode;
  if(localStorage.getItem('theme') == null){
    mode = 'light';
    localStorage.setItem('theme', mode);
  }else{
    mode = localStorage.getItem('theme');
  }

  const [theme, setTheme] = useState(mode);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [user, setUser] = useState(null);
  

  const toggleTheme = (themee) =>{
    const newTheme = themee === 'light'?'dark':'light'; 
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  }

  useEffect(()=>{
     let unsub = onAuthStateChanged(auth, user => {
          setUser(user);
          
      });
      return () => unsub();

  },[])

  return (
    <AppContext.Provider value={{showUsers, setShowUsers, user, toggleTheme ,theme, showMoreMenu, setShowMoreMenu}}>{children}</AppContext.Provider>
  )
}

export default AppProvider;