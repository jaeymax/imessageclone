import React from 'react'
import User from './User'

const Users = ( {users} ) => {

  

  return (
    <div className='users' >
      {
        users.map((user)=>(<User key={user.uid} id = {user.uid}
        name={user.displayName} about = {user.about} photoUrl={user.photoUrl} />))
      }
    </div>
  )
}

export default Users