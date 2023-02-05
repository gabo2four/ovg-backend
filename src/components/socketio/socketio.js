import {app} from '../../app'
import { Server as SocketServer } from "socket.io";
import http from 'http'

export const server = http.createServer(app)

let socketsInMatch = []
let usersDB = []
let queue = []
let rooms = []
let matchingPlayers = []

const io = new SocketServer(server,{
    cors:{
        origin: 'http://127.0.0.1:5173',
    }
})

io.on('connection',(socket)=>{
    console.log('a user connected')
    socket.on("startSearch",(mess,nick)=>{
        if(queue.filter((s)=>s.socket_id!==socket.id).length===queue.length){
            queue.push({
                ...usersDB.filter((e)=>e.nickname===nick)[0],
                inMatch:false
            })
        }
        console.log(mess,socket.id,queue)

        

    })
    socket.on("stopSearch",(mess)=>{
        const newArrSocketsId = queue.filter((s)=>s.socket_id!==socket.id)
        queue = newArrSocketsId
        console.log(mess,socket.id,queue)
    })
    
    socket.on("login-user",(nick,callback)=>{
        if(usersDB.filter((user)=>user.nickname===nick).length===0){
            usersDB.push({
                nickname:nick,  
                socket_id:socket.id
            })  
            console.log("usersDB",usersDB)
            console.log("actual user",nick)
            socket.emit("logged",nick)
            callback(true)
        }
    })

    socket.on("throw-dices",(posEnemyDices,idRoom)=>{
        socket.to("room"+idRoom).emit("posi-enemy-dices",posEnemyDices)
    })

    socket.on("selected-dice",(selectedDices,bool,diceId)=>{
        const roomsObject = socket.rooms.values()
        roomsObject.next().value
        socket.to(roomsObject.next().value).emit("enemy-selected-dice",selectedDices,bool,diceId)
    })
})


setInterval(() => {
    matchUsers()
}, 3000)
  

const matchUsers = () =>{
    if(queue.length>=2){
        matchingPlayers.push(queue[0])
        matchingPlayers.push(queue[1])
        //New Room
        matchingPlayers.map(e=>{
            socketsInMatch.push({idRoom:rooms.length,...e})
            io.in(e.socket_id).socketsJoin("room"+rooms.length) 
        })
        io.to("room"+rooms.length).emit("in-match",matchingPlayers,rooms.length)
        
        rooms.push("room"+rooms.length)
        const pairs = queue.splice(2)
        queue = pairs
        matchingPlayers = []

    }

    
    console.log("General Queue Active",rooms)
}