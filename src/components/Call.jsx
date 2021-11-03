import React, { useState } from 'react'
import Peer from "simple-peer"
import {io} from 'socket.io-client';
const socket = io("http://localhost:3100/",{ transports : ['websocket']});
function Call({video,stream,MyId}) {
    const [UserToCall,SetUserToCall] = useState(null);
    const [myId,setMyid] = useState(null)
    const call = () => {
        const peer = new Peer({initiator : true,trickle : false,stream});
             peer.on('signal',function(data){
        })
    }
    socket.on("My-id",(id) => {
        setMyid(id);
    })
    return (
        <div>
        <div style = {{
        width : "300px",
        height : "300px",
        display : "flex",
        alignItems : "center",
        justifyContent : "center"
         }}>
        <video ref = {video} autoPlay/>
    </div>
    
    <div style = {{
         marginTop : "100px"
    }}>
        <input 
        style = {{
        height : "40px",
        fontSize : "20px"
        }}
        type = "text" 
        placeholder = "Enter user id to call!!"
        onChange = {(e) => {
          SetUserToCall(e.target.value);  
        }}
        />
        <button style = {{
            width : "100px",
            height : "50px",
            backgroundColor : "green",
            color : "white",
            borderRadius: "40px",
            marginLeft : "10px"
        }} onClick = {call}> 
        call perrr
        </button>
    </div>
        </div>
    )
}

export default Call
