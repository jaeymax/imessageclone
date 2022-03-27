import React from 'react'
import { Avatar } from '@material-ui/core'
import { MoreVert } from '@material-ui/icons'
import { Call } from '@material-ui/icons'
import { VideoCall } from '@mui/icons-material'
import { ArrowBack } from '@material-ui/icons'
import {Link} from 'react-router-dom';
import { IconButton } from '@material-ui/core'
import Moment from 'react-moment';

const StatusBar = ({photoUrl, roomName, isOnline, lastSeen}) => {
  return (
    <div className='statusBar' >
        <div className='statusBar__left' >
            <Link to='/'  style = {{color:'white'}} >
                <IconButton style = {{color:'white'}} >
               <ArrowBack/>
                </IconButton>
            </Link>
            <Avatar src = {photoUrl} />
        </div>
        <div className = 'statusBar__middle' >
            <h5>{roomName}</h5>
            {isOnline? <p>online</p>:<p>last seen <Moment fromNow >{lastSeen.toDate()}</Moment></p>}
        </div>
        <div className = 'statusBar__right' >
            <IconButton style = {{color:'white'}} >
            <VideoCall/>
            </IconButton>
            <IconButton style = {{color:'white'}} >
            <Call/>
            </IconButton>
            <IconButton style = {{color:'white'}} >
            <MoreVert/>
            </IconButton>
        </div>
    </div>
  )
}

export default StatusBar