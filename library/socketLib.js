const socketio = require('socket.io');
const mongoose = require('mongoose');
const shortid = require('shortid');
const logger = require('./../library/loggerLib');

//for event driven programming
const events = require('events');
const eventEmitter = new events.EventEmitter();


const tokenLib = require('./../library/tokenLib');
const check = require('./../library/checkLib');
const response = require('./../library/responseLib');
const ChatModel = mongoose.model('ChatModel');
const UserModel = mongoose.model('UserModel');
const RoomModel = mongoose.model('ChatRoomModel');


//importing redisLibrary
const redisLib = require("./redisLib");

let setServer = (server) => {
    let io = socketio.listen(server);//collection of all the connections on server

    let myIo = io.of('');//global instance of io can be used for cross socket communication.

    //main event handler all events will be inside it.
    myIo.on('connection', (socket) => {
        socket.emit('verifyUser', 'user verified');

        //code to verify the user and setting him online

        socket.on('set-user', (authToken) => {
            tokenLib.verifyClaimsWithoutSecret(authToken, (err, user) => {
                if (err) {
                    socket.emit('auth-error', { status: 500, error: 'Incorrect AuthToken' });
                }
                else {
                    let currentUser = user.data;
                    socket.userId = currentUser.userId;// setting socket userId
                    let fullName = `${currentUser.firstName} ${currentUser.lastName}`;
                    let key = currentUser.userId;
                    let value = fullName;
                    let setUserOnline = redisLib.setANewOnlineUserInHash("onlineUser", key, value, (err, result) => {
                        if (err) {
                            logger.error(err.message, "socketLib:SetANewOnlineUserInHash", 10);
                        }
                        else {

                            redisLib.getAllUsersInAHash('onlineUser', (err, result) => {
                                
                                if (err) {
                                    console.log(err);
                                }
                                else {

                                    //placing every user in one global room
                                    socket.join("globalRoom");
                                    //socket.broadcast.to("globalRoom").emit('online-user-list', result);
                                    myIo.to("globalRoom").emit('online-user-list', result);

                                }
                            });

                        }
                    });//end setNewonlineUserInHash
                    //info to socket about group of user
                    socket.groups = currentUser.groups;
                    socket.fullName = fullName;
                    for (let room of currentUser.groups) {
                        socket.join(room);
                        console.log('Room Joined :  '+ room)
                    }

                }
            });//end verifyClaimsWithoutSecret
        });//end set-user event
         
        //joins socket room
        socket.on(socket.userId, (data) => {
            socket.join(data.roomId);
           // myIo.to(data.room).emit('GroupJoined', data);
        });//end userid event

        socket.on('disconnect', () => {
            //user will emit when disconnected
            //will remove user from online user list

            if (socket.userId) {
                redisLib.deleteUserFromHash('onlineUser', socket.userId);
                redisLib.getAllUsersInAHash('onlineUser', (err, result) => {
                    if (err) {
                        logger.error(err.message, "socketLib:getAllUsersInAHash", 10);
                    }
                    else {
                        socket.leave("globalRoom");
                        myIo.to("globalRoom").emit('online-user-list', result);
                        for (let room of socket.groups) {
                            socket.leave(room);
                            
                        }
                    }
                });//end getAllUsersInAHash
            }
        });//end disconnect event

        socket.on('chat-msg', (data) => {
            data.chatId = shortid.generate();
            //event which saves chat message.
            console.log(data)
            setTimeout(function () {
                eventEmitter.emit('save-chat', data);
            }, 2000);
            socket.broadcast.emit('message', data);
          //  myIo.to(data.receiverId).emit('message', data);
        });//end chat-msg Event

        socket.on('userTyping', (data) => {

         //   myIo.to(data.room).emit('typing', data);

            socket.broadcast.emit('typing', data);

        });//end typing

        socket.on('GroupClosed', (data) => {
            myIo.to("globalRoom").emit('closedGroup', data);
        });//end GroupClosed

        socket.on("newGroup", (roomDetails) => {

            myIo.to("globalRoom").emit('GroupCreated', roomDetails);
        });//end GrpCreated

        socket.on("GrpDeleted", (roomDetails) => {

            myIo.to("globalRoom").emit('GroupRemoved', roomDetails);
        });//end GrpCreated

    });//end connection event
}//end setServer

//database operations should be kept outside the socket.io  code

//saving chats to database.
eventEmitter.on('save-chat', (data) => {

    let newChat = new ChatModel({

        chatId: data.chatId,
        senderName: data.senderName,
        senderId: data.senderId,
        receiverId: data.receiverId,
        receiverName: data.receiverName,
        message: data.message,
        chatRoom: data.chatRoom,
        createdOn: data.createdOn
    });

    newChat.save((err, result) => {

        if (err) {
            logger.error("error occured", "socketLib:save-chat", 10);
        }
        else if (check.isEmpty(result)) {
            logger.error("chat is missing", "socketLib:save-chat", 10);
        }
        else {
            logger.info("Chat saved ", "socketLib:save-chat", 10);
        }
    });
});//end eventEmitter

module.exports = {
    setServer: setServer
}
