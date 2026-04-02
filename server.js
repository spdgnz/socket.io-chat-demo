//3rd party modules from npm
const express = require('express');
const app = express();
const socketio = require('socket.io');
const Room = require('./classes/Room');

const namespaces = require('./data/namespaces');

console.clear();
console.log("STARTED");

//to serve statically evrything in the public folder
app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000);
const io = socketio(expressServer);

//endpoint to call to change the namespace 
app.get('/change-ns', (req, res) => {
    //upgrade the namespaces array
    let editedNs = namespaces[0]
    editedNs.addRoom(new Room(3, 'New  Room', 0));
    io.of(namespaces[0].endpoint).emit('nsChange', editedNs)
    res.json(editedNs);
});

//connessione al main namespace
io.on('connection', (socket) => {

    const userName = socket.handshake.auth.userName;

    console.log(socket.id, "has connected");
    socket.emit('welcome', 'Welcome to the server');
    socket.on('clientConnect', (data) => {
        console.log("messaggio da", socket.id);
        socket.emit('nsList', namespaces);
    });
});

//connessione ai namespace
namespaces.forEach( namespace => {
    io.of(namespace.endpoint).on('connection', (socket) => {
        console.log(`${socket.id} has connected to ${namespace.endpoint} `);


        socket.on('leaveNsRooms', (namespaceId) => {
            console.log('leaveRooms', namespaceId);
            const rooms = socket.rooms
            const nsEndpoint = namespaces[namespaceId].endpoint;
            rooms.forEach( (room) => {
                if(socket.id != room) {
                    socket.leave(room);
                    emitUsersNum(nsEndpoint, room);
                }
            })

        });

        // join a new room chat
        socket.on('joinRoom', (roomObj, ackCallBack) => {

            //recupero l'history della stanza
            const thisNs = namespaces[roomObj.namespaceId];
            //console.log('thisNs', thisNs)
            const thisRoomObj = thisNs.rooms.find(room => room.roomTitle === roomObj.roomTitle);
            //console.log(roomObj.roomTitle)
            //console.log('thisRoomObj', thisRoomObj)
            const thisRoomHistory = thisRoomObj.history;

            // --- leave all rooms before you join a new one
            const rooms = socket.rooms
            rooms.forEach( (room) => {
                // we don't want to leave the socket's personal room
                if(socket.id != room) {
                    socket.leave(room);
                    emitUsersNum(thisNs.endpoint, room);
                }
            })
            
            // --- join the room
            socket.join(roomObj.roomTitle);
            console.log(socket.id, 'joined', roomObj.roomTitle);

            

            emitUsersNum(thisNs.endpoint, roomObj.roomTitle);


            
            //ritorno il l'history nella callback
            ackCallBack({
                thisRoomHistory
            });
        })

        // --- quando ricevo il messaggio da un user  lo inoltro a tutti i partecipanti della chat
        socket.on('newMessageToRoom', messageObj => {
            //console.log('messageObj', messageObj);

            const rooms = socket.rooms;
            const currentRoom = [...rooms][1];

            const nsEndpoint = namespaces[messageObj.selectedNsId].endpoint;

            io.of(nsEndpoint).in(currentRoom).emit('messageToRoom', messageObj);

            //aggiungo il messaggio alla hystory della stanza
            const thisNs = namespaces[messageObj.selectedNsId];
            const thisRoom = thisNs.rooms.find(room => room.roomTitle === currentRoom);
            
            //salvo il messaggio nell history
            thisRoom.addMessage(messageObj);
        });      
    });
});

const emitUsersNum = async (namespace, room) => {
    // --- fetch and return to the client the nuber of sockets in this room (user count)
    const sockets = await io.of(namespace).in(room).fetchSockets();
    const socketsCount = sockets.length;
    io.of(namespace).to(room).emit("numUsers", socketsCount);
}