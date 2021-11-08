import React, { useEffect, useRef, useState } from 'react'
import Peer from "simple-peer"
import {FcVideoCall,FcEndCall} from 'react-icons/fc'
import { io } from 'socket.io-client';
const socket = io("http://localhost:3100/", { transports: ['websocket'] });
function Call({ video, stream, setstream }) {
    const [UserToCall, SetUserToCall] = useState(null);
    const [UserName, setUserName] = useState(null)
    const [myId, setMyid] = useState(null)
    const [CalledUser, setCalledUser] = useState({})
    const [CallAccsepted, setCallAccsepted] = useState(false);
    const [ReciviningCall, setReciviningCall] = useState(false);
    const [callEnded,setcallEnded] = useState(false);
    const UserVideo = useRef();
    useEffect(() => {

        socket.on("My-id", (id) => {
            console.log("Your socket id  = " + id);
            setMyid(id);
        })


        socket.on("Acall", ({ UserName,stream,Me }) => {
            setCalledUser({UserName,stream,Me})
            setReciviningCall(true);
        })
    }, [])
    const call = () => {
        if(!UserName){ 
            const userName = prompt("Plese enter your username")
            setUserName(userName);
        }

        if(!UserToCall){ 
            const socketId = prompt("Plese Socket user")
            SetUserToCall(socketId);
        }

        const peer = new Peer({ initiator: true, trickle: false, stream });
        peer.on('signal',(data) => {
            socket.emit('CallPerson',({
                UserName : UserName,
                Me : myId,
                UserToCall : UserToCall,
                stream : data
            }));
        })
        socket.on('callAccsepted',({stream}) => {
            setCallAccsepted(true)
            peer.signal(stream);
        })
        peer.on('stream',(currentstream) => {
            UserVideo.current.srcObject = currentstream;
            console.log("user 2 stream")
        })
        SetUserToCall("")
        setUserName("")
    }
    const answerCall = () => { 
        setCallAccsepted(true);
        const peer = new Peer({initiator : false,trickle : false, stream});
        peer.on('signal',(data) => { 
            socket.emit('AnswerIncomingCall',{stream : data,from : CalledUser.Me});
        })
        peer.on('stream',(currentstream) => { 
            UserVideo.current.srcObject = currentstream;
            console.log("User 1 video stream")
        })

        peer.signal(CalledUser.stream);
    }
    const EndCall = () => {
        setCallAccsepted(false);
        setcallEnded(true)
        window.location.reload();

    }
    return (
        <div>
            <div className = 'VideoBox'>
                {
                    stream && (
                        <div>
                            <video 
                            className = "videos"
                            ref = {video}
                            autoPlay 
                            />
                        </div>
                    )
                }
                {
                    CallAccsepted && !callEnded && UserVideo ? (
                        <div>
                             <video
                                ref = {UserVideo} 
                                autoPlay 
                                className = "videos"
                            />
                        </div>
                    ) : (
                        <div></div>
                    )
                }
            </div>
            {
                !CallAccsepted ? ( 
                    <div className = 'inputBox'>
                 <input
                    style = {{
                        marginBottom: "20px"
                    }}
                    className = 'InputId'
                    type="text"
                    placeholder="Enter Your Username"
                    onChange={(e) => {
                        setUserName(e.target.value);
                    }}
                    value = {UserName}
                />
                <br/>
                <input
                    className = 'InputId'
                    type="text"
                    placeholder="Enter user id to call!!"
                    onChange={(e) => {
                        SetUserToCall(e.target.value);
                    }}
                    value = {UserToCall}
                />
                
                <button 
                className = 'CallButton'
                onClick={call}>
                    call perrr
                </button>
            </div>
                ) : (
                    <div className = "CallBox">
                    <h2>End Call</h2>
                    <FcEndCall
                    style = {{
                        paddingLeft: "10px",
                        fontSize : "40px",
                        cursor : "pointer"
                    }}
                    onClick = {EndCall}
                    />
                   </div>
                )
            }
            {
                 ReciviningCall && !CallAccsepted && (
                    <div className = 'CallsBox'>
            
               
                    <div
                    style = {{
                        display : "flex",
                        padding: "10px"
                    }}
                    >
                        <p>Called user {CalledUser.UserName}</p>
                        <FcVideoCall 
                        style = {{
                            marginTop : "5px",
                            fontSize : "40px",
                            marginLeft : "10px", 
                            cursor : "pointer"
                        }}
                        onClick = {answerCall}
                        />
                    </div>
            </div>
                 )
            }
        </div>
    )
}

export default Call
