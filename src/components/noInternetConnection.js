import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';

const NoInternetConnection = (props) => {
    // state variable holds the state of the internet connection
    const [isOnline, setOnline] = useState(true);
     // On initization set the isOnline state.
     useEffect(()=>{
        setOnline(navigator.onLine)
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
        <div>NoInternetConnection</div>}
    </div>
  )
}

export default NoInternetConnection