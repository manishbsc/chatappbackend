const express = require('express');
const router = express.Router();
const chatRoomController = require("../controllers/chatRoomController");
const appConfig = require("./../config/appConfig");

let setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/chatRoom`;

    app.post(`${baseUrl}/createChatRoom`, chatRoomController.createChatRoom);

    /**
         * @apiGroup ChatRoom
         * @apiVersion  1.0.0
         * @api {post} /api/v1/chatRoom/createChatRoom to create Chat Room
         *
         * @apiParam {string} userEmail email of the user creating chat group. (body params) (required)
         * @apiParam {string} roomName Name of the group to be created. (body params) (required)
         *
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
            {
                "error": false,
                "message": "room saved to user details",
                "status": 200,
                "data": {
                    "roomId": "xW4j6RDoh",
                    "roomName": "MyGroup",
                    "creator": "",
                    "members": [
                        {
                            "name": "Manish ,
                            "Id": "hMlnAHuUL"
                        }
                    ],
                    "status": true,
                    "_id": "5b818ae30d2514155437591c",
                    "createdOn": "2018-08-25T16:59:15.000Z",
                    "admin": {
                        "name": "Manish",
                        "Id": "hMlnAHuUL"
                    },
                    "__v": 0
                }
            }
        *  @apiErrorExample {json} Error-Response:
        *
        * 
                {
                    "error": "true",
                    "message": "UserEmail not found",
                    "status": 500,
                    "data": null
                }


        *   
    */    


    app.post(`${baseUrl}/joinChatRoom`, chatRoomController.joinChatRoom);

    /**
         * @apiGroup ChatRoom
         * @apiVersion  1.0.0
         * @api {post} /api/v1/chatRoom/joinChatRoom To join Chat Room
         *
         * @apiParam {string} userEmail email of the user joining chat group. (body params) (required)
         * @apiParam {string} chatRoomId GroupId of the group to be Joined. (body params) (required)
         *
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
            {
                "error": false,
                "message": "User & Group Saved",
                "status": 200,
                "data": {
                    "n": 1,
                    "nModified": 1,
                    "ok": 1
                }
            }
        *  @apiErrorExample {json} Error-Response:
        *
        * 
            {
                "error": true,
                "message": "user Email Address is missing",
                "status": 500,
                "data": null
            }


        *   
    */    
    

    app.put(`${baseUrl}/:chatRoomId/editChatRoom`, chatRoomController.editChatRoom);
    /**
         * @apiGroup ChatRoom
         * @apiVersion  1.0.0
         * @api {put} /api/v1/chatRoom/:chatRoomId/editChatRoom To edit Chat Room
         *
         * @apiParam {string} chatRoomId GroupId of the group to be edited. (route params) (required)
         * @apiParam {string}  roomName  New Name of the group. (body params) (required)
         * 
         *
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
                {
                    "error": false,
                    "message": "chatRoom edited",
                    "status": 200,
                    "data": {
                        "n": 1,
                        "nModified": 1,
                        "ok": 1
                    }
                }
        *   
    */    



    app.post(`${baseUrl}/sendInvite`, chatRoomController.sendInvite);
    /**
         * @apiGroup ChatRoom
         * @apiVersion  1.0.0
         * @api {post} /api/v1/chatRoom/sendInvite To send join invitation on email
         *
         * @apiParam {string} chatRoomId GroupId of the group to be whoose invite will be sent. (body params) (required)
         * @apiParam {string}  userEmail email of the user whom invite is to sent. (body params) (required)
         *
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
             {
                "error": false,
                "message": "Mail sent Successfully",
                "status": 200,
                "data": null
    
            }
        *  @apiErrorExample {json} Error-Response:
        *
        * 
            {
                "error": true,
                "message": "user email Id is missing",
                "status": 500,
                "data": null
            }

        *   
    */


    app.get(`${baseUrl}/getAllChatRooms`, chatRoomController.getAllChatRooms);
    /**
         * @apiGroup ChatRoom
         * @apiVersion  1.0.0
         * @api {get} /api/v1/chatRoom/getAllChatRooms To get chat rooms details
         *
         *
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
            {
                "error": false,
                "message": "Groups found",
                "status": 200,
                "data": [
                    {
                        "roomId": "9ah9QF1fH",
                        "roomName": "Study Zone",
                        "creator": "",
                        "members": [
                            {
                                "name": "Manish",
                                "Id": "hMlnAHuUL"
                            },
                            {
                                "name": "ankit",
                                "Id": "0dE4QJP7Y"
                            }
                        ],
                        "status": true,
                        "_id": "5b7b15d249a0c61584071c4f",
                        "createdOn": "2018-08-20T19:26:10.000Z",
                        "admin": {
                            "name": "Manish",
                            "Id": "hMlnAHuUL"
                        },
                        "__v": 0
                    },
                    ...................................
                ]
            }
         *  @apiErrorExample {json} Error-Response:
         *
         * {
                "error": true,
                "message": string,
                "status": number,
                "data": any
            }      
            

    */


    app.get(`${baseUrl}/:chatRoomId/getChatRoom`, chatRoomController.getChatRoom);

    /**
         * @apiGroup ChatRoom
         * @apiVersion  1.0.0
         * @api {get} /api/v1/chatRoom/:chatRoomId/getChatRoom To get single chat room details
         *
         *  @apiParam {string} chatRoomId GroupId of the group whoose details will be returned. (route params) (required)
         *
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
            {
                "error": false,
                "message": "Groups found",
                "status": 200,
                "data": [
                    {
                        "roomId": "9ah9QF1fH",
                        "roomName": "Study Zone",
                        "creator": "",
                        "members": [
                            {
                                "name": "Manish",
                                "Id": "hMlnAHuUL"
                            },
                            {
                                "name": "Ankit",
                                "Id": "0dE4QJP7Y"
                            }
                        ],
                        "status": true,
                        "_id": "5b7b15d249a0c61584071c4f",
                        "createdOn": "2018-08-20T19:26:10.000Z",
                        "admin": {
                            "name": "Manish",
                            "Id": "hMlnAHuUL"
                        },
                        "__v": 0
                    }
                ]
            }
         *  @apiErrorExample {json} Error-Response:
         *
         * {
                "error": true,
                "message": string,
                "status": number,
                "data": any
            }                  
    */


    app.get(`${baseUrl}/:chatRoomId/closeGroup`, chatRoomController.closeChatRoom);
    /**
         * @apiGroup ChatRoom
         * @apiVersion  1.0.0
         * @api {get} /api/v1/chatRoom/:chatRoomId/closeGroup To close the chat group from the Group chat application
         *
         *  @apiParam {string} chatRoomId GroupId of the group which will be marked as closed. (route params) (required)
         *
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
            {
                "error": false,
                "message": "Group found & marked close",
                "status": 200,
                "data": {
                    "n": 1,
                    "nModified": 1,
                    "ok": 1
                }
            }
         *
         *  @apiErrorExample {json} Error-Response:
         *
         * {
                "error": true,
                "message": string,
                "status": number,
                "data": any
            }       

    */

    app.put(`${baseUrl}/deleteChatRoom`, chatRoomController.deleteChatRoom);
    /**
         * @apiGroup ChatRoom
         * @apiVersion  1.0.0
         * @api {put} /api/v1/chatRoom/deleteChatRoom To delete Chat room
         *
         *  @apiParam {string} chatRoomId roomId of the group to be deleted. (body params) (required)
         *
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
            {
                "error": true,
                "message": "Chat Room deleted",
                "status": 200,
                "data": {
                    "n": 1,
                    "ok": 1
                }
            }
         *
         *  @apiErrorExample {json} Error-Response:
         *
         * {
                "error": true,
                "message": string,
                "status": number,
                "data": any
            }       

    */
   //app.put(`${baseUrl}/close`, chatRoomController.close);
 

}// end of setRouter




module.exports = {
    setRouter : setRouter
}