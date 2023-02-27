import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';

const NoInternetConnection = (props) => {
    // state variable holds the state of the internet connection
    const [isOnline, setOnline] = useState(true);
     // On initization set the isOnline state.
     useEffect(()=>{
        setOnline(navigator.onLine);
        console.log(isOnline)
    },[])

    // event listeners to update the state 
    window.addEventListener('online', () => {
        setOnline(true)
        window.location.reload();
    });

    window.addEventListener('offline', () => {
        setOnline(false)
    });
  return (
    <div>
        {isOnline?props.children:
        <div className='text-center'>
          <h5 className='mb-3'>Error</h5>
          <h6>No Internet Connection</h6>
        </div>
        }
    </div>
  )
}

export default NoInternetConnection