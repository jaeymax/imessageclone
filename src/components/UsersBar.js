import React from 'react'
import {IconButton} from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons'
import { MoreVert } from '@material-ui/icons'
import Search from '@material-ui/icons/Search'
import { AppContext } from '../context/appContext';
import { useContext } from 'react';

const UsersBar = ({usersCount}) => {
  const {setShowUsers} = useContext(AppContext);


  return (
    <div className='usersBar' >
        <div className='usersBar__left' >
        <IconButton style = {{color:'white'}} onClick = {() => setShowUsers(false)} >
               <ArrowBack/>
        </IconButton>
        </div>
        <div className='usersBar__middle' >
          <div>
            <h3 style={{color:'white'}} >Select user</h3>
            <p style={{color:'gray'}} >{usersCount} users</p>
          </div>
        </div>
        <div className='usersBar__right' >
        <IconButton style = {{color:'white'}} >
          <Search className = 'moreIcon' />    
          </IconButton>
            <IconButton style = {{color:'white'}} >
            <MoreVert/>
            </IconButton>
        </div>
    </div>
  )
}

export default UsersBar