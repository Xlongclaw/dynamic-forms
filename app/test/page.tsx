"use client"
import React, { useEffect, useRef } from 'react'



const Test = () => {
  // const iframeRef = useRef(null);


  // useEffect(()=>{
  
  //   const sendMessageToIframe = () =>{
  //     if(iframeRef.current){
  //       iframeRef.current.contentWindow.postMessage("Hello from Parrent","*")
  //     }
  //   }
  //   const handleMessage = (event) =>{
  //     console.log("Message from Iframe:", event.data)
  //   } 

  //   window.addEventListener('message', handleMessage, false)

  //   sendMessageToIframe();

  //   return () =>{
  //     window.removeEventListener('message',handleMessage,false)
  //   }
  // },[])

  return (
    <iframe id="if1"
    //  ref={iframeRef}
     className='w-screen h-screen'  src="https://dynamic-forms-git-master-xlongclaws-projects.vercel.app/forms/679207b2fde725d5d9a24a98"></iframe>
  )
}

export default Test