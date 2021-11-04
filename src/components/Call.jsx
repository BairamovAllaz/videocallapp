import React, { useEffect, useState } from 'react'
import Peer from "simple-peer"
import { io } from 'socket.io-client';
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

    useEffect(() => {
        socket.on("callUser", ({ signal, from, UserName }) => {
            setReciviningCall(true)
            setCalledUser({signal, from, name: UserName })
        })
    }, [])


    const call = () => {
        const UserName = prompt("Enter a username")
        setUserName(UserName);

        const peer = new Peer({ initiator: true, trickle: false, stream });
        peer.on('signal', function (data) {
            socket.emit('calluser', {
                useToCall: UserToCall,
                stream: data,
                Me: myId,
                UserName: UserName
            })
        })
        peer.on('stream', (cureentStream) => {
            video.current.srcObject = cureentStream;
        })



    }



    socket.on("My-id", (id) => {
        console.log(id);
        setMyid(id);
    })

    return (
        <div>
            <div style={{
                width: "300px",
                height: "300px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <video ref={video} autoPlay />
            </div>

            <div style={{
                marginTop: "100px"
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
                    <div>Hello</div>
                ) : (
                    <div>null</div>
                )
            }

            </div>


        </div>
    )
}

export default Call
