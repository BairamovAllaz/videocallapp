import React, { useEffect, useRef, useState } from 'react'
import Peer from "simple-peer"
import {FcCursor, FcDataEncryption, FcVideoCall} from 'react-icons/fc'
import { io } from 'socket.io-client';
import { getAllByPlaceholderText } from '@testing-library/react';
const socket = io("http://localhost:3100/", { transports: ['websocket'] });
function Call({ video, stream, setstream }) {

    ///state which user you want call
    const [UserToCall, SetUserToCall] = useState(null);
    ///your username
    const [UserName, setUserName] = useState(null)
    ///your uniq id
    const [myId, setMyid] = useState(null)
    ///
    const [CalledUser, setCalledUser] = useState({})
    ///call accseptted;
    const [CallAccsepted, setCallAccsepted] = useState(false);
    const [ReciviningCall, setReciviningCall] = useState(false);
    const UserVideo = useRef();
    useEffect(() => {
        socket.on("callUser", ({ signal, from, UserName }) => {
            setCalledUser({signal, from, name: UserName })
            setReciviningCall(true);
        })
    }, [])
    const call = () => {
        const UserName = "Ellez"
        setUserName(UserName);
        const peer = new Peer({ initiator: true, trickle: false, stream });
        peer.on('signal', function (data) {
            // setReciviningCall(true)
            socket.emit('calluser', {
                useToCall: UserToCall,
                stream: data,
                Me: myId,
                UserName: UserName
            })
        })
        // peer.on('stream', (cureentStream) => {
        //     video.current.srcObject = cureentStream;
        // })
        SetUserToCall("")
    }
    const answerCall = () => { 
        setCallAccsepted(true);
        const peer = new Peer({ initiator: true, trickle: false, stream });
        peer.on('signal',(data) => {
            socket.emit("answerCall",{signal : data,to : CalledUser.from})
        })
        peer.on('stream',(currentstream) => { 
            UserVideo.current.srcObject = currentstream;
        })
        peer.signal(CalledUser.signal)
        console.log(peer);
    }
    socket.on("My-id", (id) => {
        console.log(id);
        setMyid(id);
    })
    return (
        <div>
            <div style={{
                width: "200px",
                height: "200px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <video ref={video} autoPlay />
                { 
                    CallAccsepted ? ( 
                        <div>
                            <video ref = {UserVideo} autoPlay/>
                        </div>
                    ) : (
                        <div></div>
                    )
                }
            </div>

            <div style={{
                marginTop: "140px"
            }}>
                <input
                    style={{
                        height: "40px",
                        fontSize: "20px"
                    }}
                    type="text"
                    placeholder="Enter user id to call!!"
                    onChange={(e) => {
                        SetUserToCall(e.target.value);
                    }}
                    value = {UserToCall}
                />
                <button style={{
                    width: "100px",
                    height: "50px",
                    backgroundColor: "green",
                    color: "white",
                    borderRadius: "40px",
                    marginLeft: "10px"
                }} onClick={call}>
                    call perrr
                </button>
            </div>


            <div
                style={{
                    width: "100%",
                    height: "70px",
                    border: "solid 1px black",
                    marginTop: "50px",
                    display: "flex",
                    alignItems: "center"
                }}>
            {
                ReciviningCall ? (
                    <div
                    style = {{
                        display : "flex",
                        padding: "10px"
                    }}
                    >
                        <p>Called user {CalledUser.name}</p>
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
                ) : (
                    <div>null</div>
                )
            }

            </div>


        </div>
    )
}

export default Call
