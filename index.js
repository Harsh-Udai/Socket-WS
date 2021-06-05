// const io = require('socket.io')(process.env.PORT,{
//     cors:{
//         origin: 'https://resourcesharingio.netlify.app/',
//     },
// });

const io = require('socket.io')('http://localhost:3000');

let users = [];

const addUser=(userId,socketId)=>{
    !users.some((user)=>user.userId===userId) &&
    users.push({userId,socketId});
}

const removeUser = (socketId)=>{
    users = users.filter(user => user.socketId!==socketId);
}

const getUser = (userId)=>{
    return users.find((user)=>user.userId===userId)
}

io.on("connection",(socket)=>{
    console.log("a user connnected");
    //take userId and socketId from user
    socket.on('addUser',userId=>{
        if(userId!==""){
            addUser(userId,socket.id);
            io.emit('getUsers', users);
        }
    })
    //send and get message
    socket.on("sendMessage",({senderId,receiverId,text})=>{
        const user = getUser(receiverId);
        if(user){
            io.to(user.socketId).emit('getMessage',{
                senderId,
                text,
            })
        }
    })
    // when disconnect
    socket.on('disconnect',()=>{
        console.log('a user got disconnected');
        removeUser(socket.id);
        console.log(users);
        io.emit('getUsers', users);
    })
})
