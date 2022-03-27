import React from 'react'
import CircularProgress from '@mui/material/CircularProgress';


const Spinner = () => {
  return (
    <div className = 'spinner' >
    <CircularProgress color = 'success' />
  </div>
  )
}

export default Spinner