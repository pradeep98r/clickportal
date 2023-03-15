import React, { useState, useEffect } from "react";

const Timer = (props) => {
  const [time, setTime] = useState(59);
  const [resend, setResend] = useState(false)
  useEffect(() => {
    if (time > 0) {
      const intervalId = setInterval(() => setTime(time - 1), 1000);
      return () => clearInterval(intervalId);
    }
    if(time == 0){
        setResend(true);
        props.resend(true);
    }
  }, [time,props.EditStatus]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return (
    <div>
        {resend?'':
      <p>Time left:<span id="timer">{"0"+minutes}:{seconds < 10 ? `0${seconds}` : seconds}</span></p>}
       {/* <p onClick={() => setTime(10)}>Resend</p>}  */}
    </div>
  );
};

export default Timer;
