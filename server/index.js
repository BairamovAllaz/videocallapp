const express = require("express");
const app = express();
const http = require("http").createServer(app);
const cors = require("cors");
const { start } = require("repl");
const io = require("socket.io")(http,{
    cors : {
        origin : ["http://localhost:3000/"],
        credentials : true
    }
})

app.use(cors({
    origin : true,
    credentials : true
}))

app.get("/",(req,res) => {
    res.send("Hello world")
})
io.on('connection',(socket) => {
    console.log("A user connected!!!")
    socket.emit("My-id",socket.id);


    socket.on('CallPerson',({ 
        UserName,///Username whice call this user!
        Me,///Called username
        UserToCall,///this user id
        stream //Called user stream(video)
    }) => {  
        io.to(UserToCall).emit("Acall",({UserName,stream,Me}))
    })

    ///answer incoming call user 2

    socket.on('AnswerIncomingCall',({stream,from}) => {
        io.to(from).emit('callAccsepted',{stream : stream})
        console.log("You accespedt call which from   " + from);
    })








    // socket.on('calluser',({useToCall,stream,Me,UserName}) => { 
    //     io.to(useToCall).emit("callUser",{signal : stream,from : Me,UserName : UserName})
    // })

    // socket.on('answerCall',({signal,to}) => {
    //     io.to(signal.to).emit('Call-accsepted',signal.data)
    // })

})

const PORT = process.env.PORT || 3100;
http.listen(PORT,() => {
    console.log(`OUR APP RUNNING IN ${PORT}`)
})