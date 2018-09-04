const mongoose = require('mongoose');
const shortid = require('shortid');

const time = require('../library/timeLib');
const response = require('../library/responseLib');
const logger = require('../library/loggerLib');
const passwordLib = require('../library/generatePasswordLib');
const token = require('../library/tokenLib');
const check = require('../library/checkLib');
const validateInput = require('../library/paramsValidationLib');


const mailer = require('../library/mailerLib');


const UserModel = mongoose.model('UserModel')
const AuthModel = mongoose.model('AuthModel')
const ChatRoomModel = mongoose.model('ChatRoomModel')

let createChatRoom = (req, res) => {
    let createRoom = () => {
        return new Promise((resolve, reject) => {

            if (check.isEmpty(req.body.userEmail)) {
                logger.error("UserEmail Not Found", "chatRoomController:createChatRoom()", 10);
                let apiResponse = response.generate("true", "UserEmail not found", 500, null);
                reject(apiResponse);
            } else {
                let newChatRoom = new ChatRoomModel({
                    roomId: shortid.generate(),
                    roomName: req.body.roomName
                });

                UserModel.findOne({ email: req.body.userEmail }, (err, userDetails) => {
                    if (err) {
                        logger.error(err.message, "chatRoomController:createChatRoom()", 10);
                        let apiResponse = response.generate("true", "Failed to find user chat room not created.", 500, null);
                        reject(apiResponse);
                    }
                    else if (check.isEmpty(userDetails)) {
                        logger.error(err.message, "chatRoomController:createChatRoom()", 10);
                        let apiResponse = response.generate("true", "No user found & chat room creation failed.", 500, null);
                        reject(apiResponse);
                    }
                    else {
                        let owner = {}
                        owner.name = userDetails.firstName + userDetails.lastName;
                        owner.Id = userDetails.userId;
                        newChatRoom.admin = owner;
                        newChatRoom.members.push(owner);
                        userDetails.groups.push(newChatRoom.roomId);

                        newChatRoom.save((err, newChatRoom) => {
                            if (err) {
                                logger.error(err.message, "chatRoomController:createChatRoom()", 10);
                                let apiResponse = response.generate("true", "Failed to create Chat Room", 500, null);
                                reject(apiResponse);
                            }
                            else {
                                logger.info("chat room created successfully", "chatRoomController:createChatRoom()", 10);
                                let data = {};
                                data.userdetails = userDetails;
                                data.newRoom = newChatRoom;
                                resolve(data);
                            }
                        });
                    }
                });//end findOne
            }
        });//end promise

    }//end createRoom

    let saveDetails = (data) => {

        return new Promise((resolve, reject) => {

            UserModel.update({ userId: data.userdetails.userId }, { groups: data.userdetails.groups }, { multi: true }, (err, result) => {
                if (err) {
                    logger.error(err.message, "chatRoomController:createChatRoom()", 10);
                    let apiResponse = response.generate("true", "Failed to save user chat details.", 500, null);
                    reject(apiResponse);
                }
                else if (check.isEmpty(result)) {
                    logger.error("User details not Saved", "chatRoomController: CreateChatRoom", 10);
                    let apiResponse = response.generate(true, "unable to save user to chat room", 500, null);
                    reject(apiResponse);
                } else {
                    logger.info("chatRoom saved to user details", "chatRoomController: createChatRoom", 10);
                    resolve(data.newRoom);
                }
            });//end update for saving new room
        });//end promise
    }//end saveDetails


    createRoom(req, res)
        .then(saveDetails)
        .then((result) => {
            let apiResponse = response.generate(false, "room saved to user details", 200, result);
            res.send(apiResponse);
        })
        .catch((err) => {
            res.send(err);
        });

}//end create chat room

let joinChatRoom = (req, res) => {

    let findUser = () => {

        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.body.userEmail)) {
                logger.error("userEmail is missing", "chatRoomController: sendInvite", 10);
                let apiResponse = response.generate(true, "user Email Address is missing", 500, null);
                reject(apiResponse);
            }
            else {

                UserModel.findOne({ email: req.body.userEmail }, (err, userDetails) => {
                    /* handle the error if the user is not found */
                    if (err) {
                        logger.error('Failed to retrieve user Data', "userController: findUser()", 10);
                        let apiResponse = response.generate(true, "failed to find the user with given email", 500, null);
                        reject(apiResponse);
                    }/* if company details is not found */
                    else if (check.isEmpty(userDetails)) {
                        logger.error("No User Found", "userController: findUser()", 10);
                        let apiResponse = response.generate(true, "No user Details Found", 500, null);
                        reject(apiResponse);
                    }
                    else {
                        logger.info("user found", "userController: findUser()", 10);
                        let details = {};
                        details.userDetails = userDetails;
                        resolve(details);
                    }
                });
            }
        });
    }//end findUser()

    let findRoom = (details) => {

        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.body.chatRoomId)) {
                logger.error("chatRoomId is missing", "chatRoomController: sendInvite", 10);
                let apiResponse = response.generate(true, "chatRoomId is missing", 500, null);
                reject(apiResponse);
            }
            else {

                ChatRoomModel.findOne({ roomId: req.body.chatRoomId }, (err, roomDetails) => {
                    /* handle the error if the user is not found */
                    if (err) {
                        logger.error('Failed to retrieve Group Data', "chatRoom: findRoom", 10);
                        let apiResponse = response.generate(true, "failed to find the Group with given chatRoomId", 500, null);
                        reject(apiResponse);
                    }/* if company details is not found */
                    else if (check.isEmpty(roomDetails)) {
                        logger.error("No Group Found", "chatRoomController: findRoom", 10);
                        let apiResponse = response.generate(true, "No Group Details Found", 500, null);
                        reject(apiResponse);
                    }
                    else {
                        logger.info("Group found", "chatRoomController: findRoom", 10);
                        details.roomDetails = roomDetails;
                        resolve(details);
                    }
                });
            }
        });
    }//end findRoom()

    let saveRoom = (details) => {

        return new Promise((resolve, reject) => {
            let user = {};
            user.name = `${details.userDetails.firstName} ${details.userDetails.lastName}`;
            user.Id = details.userDetails.userId;
            details.roomDetails.members.push(user);

            ChatRoomModel.update({ roomId: req.body.chatRoomId }, { members: details.roomDetails.members }, { multi: true }, (err, result) => {
                if (err) {
                    logger.error(err.message, "chatRoomController:createChatRoom()", 10);
                    let apiResponse = response.generate("true", "Failed to save room details.", 500, null);
                    reject(apiResponse);
                }
                else if (check.isEmpty(result)) {
                    logger.error("User details not Saved", "chatRoomController: CreateChatRoom", 10);
                    let apiResponse = response.generate(true, "unable to save user to chat room", 500, null);
                    reject(apiResponse);
                } else {
                    logger.info("user saved to room details", "chatRoomController: createChatRoom", 10);
                    resolve(details);
                }
            });//end update for saving new room
        });//end promise
    }//end saveRoom


    let saveUser = (details) => {

        return new Promise((resolve, reject) => {
            details.userDetails.groups.push(req.body.chatRoomId);

            UserModel.update({ email: req.body.userEmail }, { groups: details.userDetails.groups }, { multi: true }, (err, result) => {
                if (err) {
                    logger.error(err.message, "chatRoomController:createChatRoom()", 10);
                    let apiResponse = response.generate("true", "Failed to save user chat details.", 500, null);
                    reject(apiResponse);
                }
                else if (check.isEmpty(result)) {
                    logger.error("User details not Saved", "chatRoomController: CreateChatRoom", 10);
                    let apiResponse = response.generate(true, "unable to save user to chat room", 500, null);
                    reject(apiResponse);
                } else {
                    logger.info("chatRoom saved to user details", "chatRoomController: createChatRoom", 10);
                    resolve(result);
                }
            });//end update for saving new room
        });//end promise
    }//end saveDetails

    findUser(req, res)
    .then(findRoom)
    .then(saveRoom)
    .then(saveUser)
    .then((result) => {
        let apiResponse = response.generate(false, "User & Group Saved", 200, result);
        res.send(apiResponse);
    })
    .catch((err) => {
        res.send(err);
    });




}

let editChatRoom = (req, res) => {
    if (check.isEmpty(req.params.chatRoomId)) {
        logger.error("chatRoomId is missing", "chatRoomController: editchatRoom", 10);
        let apiResponse = response.generate(true, "chatRoomId is missing", 500, null);
        res.send(apiResponse);
    } else {
        let options = req.body;
    
        ChatRoomModel.update({ roomId: req.params.chatRoomId },{roomName : req.body.roomName}, { multi: true }, (err, roomDetails) => {

            if (err) {
                logger.error("Failed to edit chatRoom", "chatRoomController: editChatRoom", 10);
                let apiResponse = response.generate(true, "Failed to edit chatRoom", 500, null);
                res.send(apiResponse);
            }
            else if (check.isEmpty(roomDetails)) {
                logger.error("chatRoom not found", "chatRoomController: editChatRoom", 10);
                let apiResponse = response.generate(true, "chatRoom not found", 500, null);
                res.send(apiResponse);
            }
            else {
                logger.info("chatRoom edited", "chatRoomController: editChatRoom", 10);
                let apiResponse = response.generate(false, "chatRoom edited", 200, roomDetails);
                res.send(apiResponse);
            }
        });
    }
}//end editChatRoom

let getAllChatRooms = (req, res) => {

    ChatRoomModel.find({}, (err, roomsDetails) => {

        /* handle the error if the user is not found */
        if (err) {
            logger.error('Failed to find rooms', "chatRoom: getAllChatRooms", 10);
            let apiResponse = response.generate(true, "failed to find the Rooms", 500, null);
            res.send(apiResponse);
        }/* if company details is not found */
        else if (check.isEmpty(roomsDetails)) {
            logger.error("No Rooms Found", "chatRoomController: getAllChatRooms", 10);
            let apiResponse = response.generate(true, "No Rooms Found", 500, null);
            res.send(apiResponse);
        }
        else {
            logger.info("Rooms found", "chatRoomController: getAllChatRooms", 10);
            let apiResponse = response.generate(false, "Groups found", 200, roomsDetails);
            res.send(apiResponse);

        }

    });

}//end getAllChatRooms
//gets all the char rooms
let getChatRoom = (req, res) => {

    if (check.isEmpty(req.params.chatRoomId)) {
        logger.error("chatRoomId is missing", "chatRoomController: closeChatRoom", 10);
        let apiResponse = response.generate(true, "chatRoomId is missing", 500, null);
        reject(apiResponse);
    }
    else {
        ChatRoomModel.findOne({ roomId: req.params.chatRoomId }, (err, roomDetails) => {

            /* handle the error if the user is not found */
            if (err) {
                logger.error('Failed to find rooms', "chatRoom: getChatRoom", 10);
                let apiResponse = response.generate(true, "failed to find the Room", 500, null);
                res.send(apiResponse);
            }/* if company details is not found */
            else if (check.isEmpty(roomDetails)) {
                logger.error("No Room Found", "chatRoomController: getChatRoom", 10);
                let apiResponse = response.generate(true, "No Room Found", 500, null);
                res.send(apiResponse);
            }
            else {
                logger.info("Room found", "chatRoomController: getChatRoom", 10);
                let apiResponse = response.generate(false, "Group found", 200, roomDetails);
                res.send(apiResponse);

            }

        });
    }

}//end getChatRoom

let sendInvite = (req, res) => {

    let findUser = () => {

        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.body.userEmail)) {
                logger.error("userEmail is missing", "chatRoomController: sendInvite", 10);
                let apiResponse = response.generate(true, "user email Id is missing", 500, null);
                reject(apiResponse);
            }
            else {

                UserModel.findOne({ email: req.body.userEmail }, (err, userDetails) => {
                    /* handle the error if the user is not found */
                    if (err) {
                        logger.error('Failed to retrieve user Data', "userController: findUser()", 10);
                        let apiResponse = response.generate(true, "failed to find the user with given email", 500, null);
                        reject(apiResponse);
                    }/* if company details is not found */
                    else if (check.isEmpty(userDetails)) {
                        logger.error("No User Found", "userController: findUser()", 10);
                        let apiResponse = response.generate(true, "No user Details Found", 500, null);
                        reject(apiResponse);
                    }
                    else {
                        logger.info("user found", "userController: findUser()", 10);
                        let details = {};
                        details.userDetails = userDetails;
                        resolve(details);
                    }
                });
            }
        });
    }//end findUser()

    let findRoom = (details) => {

        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.body.chatRoomId)) {
                logger.error("chatRoomId is missing", "chatRoomController: sendInvite", 10);
                let apiResponse = response.generate(true, "chatRoom Id is missing", 500, null);
                reject(apiResponse);
            }
            else {

                ChatRoomModel.findOne({ roomId: req.body.chatRoomId }, (err, roomDetails) => {
                    /* handle the error if the user is not found */
                    if (err) {
                        logger.error('Failed to retrieve Group Data', "chatRoom: findRoom", 10);
                        let apiResponse = response.generate(true, "failed to find the Group with given chatRoomId", 500, null);
                        reject(apiResponse);
                    }/* if company details is not found */
                    else if (check.isEmpty(roomDetails)) {
                        logger.error("No Group Found", "chatRoomController: findRoom", 10);
                        let apiResponse = response.generate(true, "No Group Details Found", 500, null);
                        reject(apiResponse);
                    }
                    else {
                        logger.info("Group found", "chatRoomController: findRoom", 10);
                        details.roomDetails = roomDetails;
                        resolve(details);
                    }
                });
            }
        });
    }//end findRoom()

    let sendMail = (details) => {
        return new Promise((reject, resolve) => {
            logger.info("User & Group found", "chatRoomController: sendMail", 10);
            mailer.autoEmail(req.body.userEmail, `<a href='groupchat.memanish.com/joinGroup/${details.roomDetails.roomId}/${details.roomDetails.roomName}'>click here to join the Chat Room</a>`, "Invitation to Join Chat");
            let apiResponse = response.generate(false, "User & Group found", 200,"Mail sent successfully");
            resolve(apiResponse);
        });

    }//end sendMail

    findUser(req, res)
        .then(findRoom)
        .then(sendMail)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            res.send(err);
        });

}//end of sendInvite()

let deleteChatRoom = (req, res) => {
   

   let deleteChatrooms=()=>{
    
         return new Promise((resolve, reject) => {
        
         if (check.isEmpty(req.body.chatRoomId)) {
        logger.error("ChaId empty", "chatRoomController:deleteChatRoom()", 10);
        let apiResponse = response.generate("true", "chatId is empty", 500, null);
        reject(apiResponse);
         }
       else {

        ChatRoomModel.remove({ roomId: req.body.chatRoomId }, (err, roomDetails) => {
            if (err) {
                logger.error(err.message, "chatRoomController:deleteChatRoom()1", 10);
                let apiResponse = response.generate("true", "Failed to chat room", 500, null);
                reject(apiResponse);
            }
            else if (check.isEmpty(roomDetails)) {
                logger.error(err.message, "chatRoomController:deleteChatRoom()2", 10);
                let apiResponse = response.generate("true", "No chat room found", 500, null);
                reject(apiResponse);
            }
            else {
                logger.info("Chat Room deleted", "chatRoomrController: deleteChatRoom()3", 10);
                resolve();
            }
        });//end room
    }

   });

}
let findUser = () => {

    return new Promise((resolve, reject) => {
        if (check.isEmpty(req.body.email)) {
            logger.error("userEmail is missing", "chatRoomController: sendInvite", 10);
            let apiResponse = response.generate(true, "user email Id is missing", 500, null);
            reject(apiResponse);
        }
        else {

            UserModel.findOne({ email: req.body.email }, (err, userDetails) => {
                /* handle the error if the user is not found */
                if (err) {
                    logger.error('Failed to retrieve user Data', "userController: findUser()", 10);
                    let apiResponse = response.generate(true, "failed to find the user with given email", 500, null);
                    reject(apiResponse);
                }/* if company details is not found */
                else if (check.isEmpty(userDetails)) {
                    logger.error("No User Found", "userController: findUser()", 10);
                    let apiResponse = response.generate(true, "No user Details Found", 500, null);
                    reject(apiResponse);
                }
                else {
                    logger.info("user found", "userController: findUser()", 10);
                    resolve(userDetails);
                }
            });
        }
    });
}//end findUser()


let deleteUserGroup=(userDetails)=>{
    logger.info("delteusergrou", "chatRoomrController: deleteChatRoom()4", 10);
    return new Promise((resolve, reject) => {
        if (check.isEmpty(req.body.email)) {
            logger.error("Email mjissing", "chatRoomController:deleteChatRoom()", 10);
            let apiResponse = response.generate("true", "chatRoom by given email not found", 500, null);
            reject(apiResponse);
        } else {
            userDetails.groups.pop(req.body.chatRoomId)

            UserModel.update({ email: req.body.email }, { groups: userDetails.groups }, { multi: true }, (err, result) => {
                if (err) {
                    logger.error(err.message, "chatRoomController:deleteusergroup()", 10);
                    let apiResponse = response.generate("true", "Failed to chat room user", 500, null);
                    reject(apiResponse);
                }
                else if (check.isEmpty(result)) {
                    logger.error(err.message, "chatRoomController:deleteusergroup()", 10);
                    let apiResponse = response.generate("true", "No chat room found User", 500, null);
                    reject(apiResponse);
                }
                else {
                    resolve(result);
                }
            });
        }
        


    });

}

deleteChatrooms(req,res)
    .then(findUser)
   .then(deleteUserGroup)
   .then((result)=>{
    let apiResponse = response.generate(false, "User & Group deleted", 200, result);
        res.send(apiResponse);

})
.catch((err)=>{
        res.send(err);

})
   
}//end delete chat room

let closeChatRoom = (req, res) => {

    if (check.isEmpty(req.params.chatRoomId)) {
        logger.error("chatRoomId is missing", "chatRoomController: closeChatRoom", 10);
        let apiResponse = response.generate(true, "chatRoomId is missing", 500, null);
        reject(apiResponse);
    }
    else {

        ChatRoomModel.update({ roomId: req.params.chatRoomId }, { status: false }, (err, roomDetails) => {

            /* handle the error if the user is not found */
            if (err) {
                logger.error('Failed to find room', "chatRoom: closeChatRoom", 10);
                let apiResponse = response.generate(true, "failed to find the Room", 500, null);
                res.send(apiResponse);
            }/* if company details is not found */
            else if (check.isEmpty(roomDetails)) {
                logger.error("No Room Found", "chatRoomController: closeChatRoom", 10);
                let apiResponse = response.generate(true, "No Room Found", 500, null);
                res.send(apiResponse);
            }
            else {
                logger.info("Room found & marked close", "chatRoomController: closeChatRoom", 10);
                let apiResponse = response.generate(false, "Group found & marked close", 200, roomDetails);
                res.send(apiResponse);
            }
        });
    }
}//end closeChatRoom


/*
let close=(req,res)=>{

let findUser = () => {

    return new Promise((resolve, reject) => {
        if (check.isEmpty(req.body.email)) {
            logger.error("userEmail is missing", "chatRoomController: sendInvite", 10);
            let apiResponse = response.generate(true, "user email Id is missing", 500, null);
            reject(apiResponse);
        }
        else {

            UserModel.findOne({ email: req.body.email }, (err, userDetails) => {
                // handle the error if the user is not found 
                if (err) {
                    logger.error('Failed to retrieve user Data', "userController: findUser()", 10);
                    let apiResponse = response.generate(true, "failed to find the user with given email", 500, null);
                    reject(apiResponse);
                }//if company details is not found 
                else if (check.isEmpty(userDetails)) {
                    logger.error("No User Found", "userController: findUser()", 10);
                    let apiResponse = response.generate(true, "No user Details Found", 500, null);
                    reject(apiResponse);
                }
                else {
                    logger.info("user found", "userController: findUser()", 10);
                    resolve(userDetails);
                }
            });
        }
    });
}//end findUser()


let deleteUserGroup=(userDetails)=>{
    logger.info("delteusergrou", "chatRoomrController: deleteChatRoom()4", 10);
    return new Promise((resolve, reject) => {
        if (check.isEmpty(req.body.email)) {
            logger.error("Email mjissing", "chatRoomController:deleteChatRoom()", 10);
            let apiResponse = response.generate("true", "chatRoom by given email not found", 500, null);
            reject(apiResponse);
        } else {
            userDetails.groups.pop(req.body.chatRoomId)

            UserModel.update({ email: req.body.email }, { groups: userDetails.groups }, { multi: true }, (err, result) => {
                if (err) {
                    logger.error(err.message, "chatRoomController:deleteusergroup()", 10);
                    let apiResponse = response.generate("true", "Failed to chat room user", 500, null);
                    reject(apiResponse);
                }
                else if (check.isEmpty(result)) {
                    logger.error(err.message, "chatRoomController:deleteusergroup()", 10);
                    let apiResponse = response.generate("true", "No chat room found User", 500, null);
                    reject(apiResponse);
                }
                else {
                    resolve(result);
                }
            });
        }
        


    });

}

    findUser(req,res)
   .then(deleteUserGroup)
   .then((result)=>{
    let apiResponse = response.generate(false, "User & Group deleted", 200, result);
        res.send(apiResponse);

})
.catch((err)=>{
        res.send(err);

})
}
  */ 

module.exports = {
    createChatRoom : createChatRoom,
    joinChatRoom : joinChatRoom,
    editChatRoom : editChatRoom,
    getAllChatRooms : getAllChatRooms,
    getChatRoom : getChatRoom,
    sendInvite : sendInvite,
    deleteChatRoom : deleteChatRoom,
    closeChatRoom : closeChatRoom,
    //close:close
}
