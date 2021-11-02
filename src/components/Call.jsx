import React from 'react'
import Peer from 'simple-peer'
function Call({video,stream}) {
    const call = () => {
        const peer = new Peer({initiator : false,trickle : false,stream});
        peer.on('signal',(data) => {
            console.log(data)
        })
    }
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

    <button style = {{
        marginTop : "100px"

    }} onClick = {() => call}> 
      call perrr
    </button>
        </div>
    )
}

export default Call
