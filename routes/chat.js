const express = require('express');
const router = express.Router();
const chatController = require("../controllers/chatController");
const appConfig = require("./../config/appConfig");

let setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/chat`;


    app.get(`${baseUrl}/getGroupChat`,chatController.getGroupChat);
        /**
             * @apiGroup Chat
             * @apiVersion  1.0.0
             * @api {get} /api/v1/chat/getGroupChat To get paginated chat of sender and receiver.
             *
             * @apiParam {string} senderId userId of logged in user. (query params) (required)
             * @apiParam {string} receiverId userId receiving user. (query params) (required)
             * @apiParam {number} skip skip value for pagination. (query params) (optional)
             * 
             * @apiSuccess {object} myResponse shows error status, message, http status code, result.
             * 
             * @apiSuccessExample {object} Success-Response:

                    {
                            "error": false,
                            "message": "All Group Chats Listed",
                            "status": 200,
                            "data": [
                            {
                                "chatId": "String",
                                "modifiedOn": "Date",
                                "createdOn": "Date",
                                "message": "String",
                                "receiverId": "String",
                                "receiverName": "String",
                                "senderId": "String",
                                "senderName": "String"
                            },
                            .........................
                            ]
                    }

                * @apiErrorExample {json} Error-Response:
                *
                *   
                    {
                        "error": true,
                        "message": "parameters missing.",
                        "status": 403,
                        "data": null
                    }

        */


}// end of setRouter

module.exports = {
    setRouter : setRouter
}