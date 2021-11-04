const express = require("express");
const app = express();
const http = require("http").createServer(app);
const cors = require("cors");
const { unstable_concurrentAct } = require("react-dom/cjs/react-dom-test-utils.production.min");
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

    socket.on("calluser",({userToCall,stream,Me,UserName}) => { 
        io.to(userToCall).emit("callUser",{signal : stream,from : Me,UserName : UserName})
    })


})

const PORT = process.env.PORT || 3100;
http.listen(PORT,() => {
    console.log(`OUR APP RUNNING IN ${PORT}`)
})