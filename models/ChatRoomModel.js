const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const time = require('./../library/timeLib');

//roomid=receiverid
const ChatRoom = new Schema({
    roomId: {
        type: String,
        default: 0,
        index: true,
        unique: true
    },
    roomName: {
        type: String,
        default: "New Group"
    },

    creator: {
        type: String,
        default: ''
      },
    admin: {},
    createdOn: {
        type: Date,
        default: time.now
    },
    members:[],
    status:{
        type: Boolean,
        default: true
    } 
});

mongoose.model('ChatRoomModel', ChatRoom);