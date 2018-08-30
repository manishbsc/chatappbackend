 const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const appConfig = require("./../config/appConfig");

let setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/users`;

    app.get(`${baseUrl}/view/all`, userController.getAllUser);

        /**
             * @apiGroup Users
             * @apiVersion  1.0.0
             * @api {get} /api/v1/users/view/all To get All users
             *
             *
             * @apiSuccess {object} myResponse shows error status, message, http status code, result.
             * 
             * @apiSuccessExample {object} Success-Response:
            {
                "error": false,
                "message": "All User Details Found",
                "status": 200,
                "data": [
                    {
                        "userId": "String",
                        "firstName": "String",
                        "lastName": "String",
                        "password": "String",
                        "email": "String",
                        "mobileNumber": Number,
                        "active": "Boolean",
                        "createdOn": "Date",
                        "groups": []
                    }
                ]
            }
        */

    app.get(`${baseUrl}/:userId/details`, userController.getSingleUser);

        /**
             * @apiGroup Users
             * @apiVersion  1.0.0
             * @api {get} /api/v1/users/:userId/details To get single user.
             *
             * @apiParam {string} userId User ID of the user. (route params) (required)
             *
             * @apiSuccess {object} myResponse shows error status, message, http status code, result.
             * 
             * @apiSuccessExample {object} Success-Response:

                {
                    "error": false,
                    "message": "User Details Found",
                    "status": 200,
                    "data": {
                        "userId": "String",
                        "firstName": "String",
                        "lastName": "String",
                        "email": "String",
                        "mobileNumber": Number,
                        "active": "Boolean",
                        "createdOn": "Date",
                        "groups": []
                    }
                }

                * @apiErrorExample {json} Error-Response:
                *
                *   {
                        "error": true,
                        "message": "No User Found",
                        "status": 404,
                        "data": null
                    }

        */


    app.put(`${baseUrl}/:userId/edit`, userController.editUser);

        /**
             * @apiGroup Users
             * @apiVersion  1.0.0
             * @api {put} /api/v1/users/:userId/edit To edit user details.
             *
             * @apiParam {string} userId User ID of the user. (route params) (required)
             *
             * @apiSuccess {object} myResponse shows error status, message, http status code, result.
             * 
             * @apiSuccessExample {object} Success-Response:
             * 
                    {
                        "error": false,
                        "message": "User details edited",
                        "status": 200,
                        "data": {
                            "n": 1,
                            "nModified": 1,
                            "ok": 1
                        }
                    }

        */
    


    app.post(`${baseUrl}/:userId/delete`, userController.deleteUser);

        /**
             * @apiGroup Users
             * @apiVersion  1.0.0
             * @api {post} /api/v1/users/:userId/delete To delete single user.
             *
             * @apiParam {string} userId User ID of the user. (route params) (required)
             *
             * @apiSuccess {object} myResponse shows error status, message, http status code, result.
             * 
             * @apiSuccessExample {object} Success-Response:

                        {
                        "error": false,
                        "message": "Deleted the user successfully",
                        "status": 200,
                        "data": {
                            "userId": "String",
                            "firstName": "String",
                            "lastName": "String",
                            "password": "$2b$10$z/AX58GM/i7usC30s9gIvOyNsc3xr80tlKzqix.qlsarLuk6.mN.u",
                            "email": "String",
                            "mobileNumber": Number,
                            "active": Boolean,
                            "createdOn": "Date",
                            "groups": [],
                            "_id": "5b6e77c10801841facb8621d",
                            "__v": 0
                        }
                        }

                * @apiErrorExample {json} Error-Response:
                *
                    {
                        "error": true,
                        "message": "No User Found",
                        "status": 404,
                        "data": null
                    }

        */
    


    app.post(`${baseUrl}/signup`, userController.signUpFunction);

        /**
             * @apiGroup Users
             * @apiVersion  1.0.0
             * @api {post} /api/v1/users/signup To Signup user.
             *
             * @apiParam {string} firstName First name of the user. (body params)
             * @apiParam {string} lastName Last name of the user. (body params)
             * @apiParam {number} mobileNumber Mobile number of the user. (body params)
             * @apiParam {string} email Email ID of the user. (body params)
             * @apiParam {string} password Password of chat account. (body params)
             * 
             * @apiSuccess {object} myResponse shows error status, message, http status code, result.
             * 
             * @apiSuccessExample {object} Success-Response:

                            {
                                "error": false,
                                "message": "User created",
                                "status": 200,
                                "data": {
                                    "userId": "String",
                                    "firstName": "String",
                                    "lastName": "Mehta",
                                    "email": "String",
                                    "mobileNumber": Number,
                                    "active": false,
                                    "createdOn": "Date",
                                    "groups": [],
                                    "_id": "5b816074f0fdc921608c6660",
                                    "__v": 0
                                }
                            }


                * @apiErrorExample {json} Error-Response:
                *
                    {
                        "error": true,
                        "message": "Failed to create new User",
                        "status": 500,
                        "data": null
                    }


        */

    app.post(`${baseUrl}/login`, userController.loginFunction);

    /**
                 * @apiGroup Users
                 * @apiVersion  1.0.0
                 * @api {post} /api/v1/users/login Login.
                 *
                 * @apiParam {string} email Email of the user. (body params) (required)
                 * @apiParam {string} password Password of the user. (body params) (required)
                 *
                 * @apiSuccess {object} myResponse shows error status, message, http status code, result.
                 * 
                 * @apiSuccessExample {object} Success-Response:
                    {
                            "error": false,
                            "message": "Login Successful",
                            "status": 200,
                            "data": {
                                "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6IkxRWkFhUll4ciIsImlhdCI6MTUzNTA4OTk0NDMxNywiZXhwIjoxNTM1MTc2MzQ0LCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJlZENoYXQiLCJkYXRhIjp7InVzZXJJZCI6ImhNbG5BSHVVTiIsImZpcnN0TmFtZSI6Ik1heXVyIiwibGFzdE5hbWUiOiJNYWhhbXVuZSIsImVtYWlsIjoibWF5dXJtYWhhbXVuZTdAZ21haWwuY29tIiwibW9iaWxlTnVtYmVyIjo3Mjc2Nzg5MDI0LCJhY3RpdmUiOmZhbHNlLCJncm91cHMiOlsiRG81UklvNlMyIiwibXFNUXNYOUtWIiwiVkdOQ2FpaXRtIiwiMVd5QXlEVXZiIiwiV3hkbVlqU2l6IiwieWJVVDVJdTVSIiwiclFyZmNBNG5DIiwiRG81UklvNlMyIiwielg2dUJ2U3ctIiwielg2dUJ2U3ctIiwielg2dUJ2U3ctIiwielg2dUJ2U3ctIiwielg2dUJ2U3ctIiwiRGJLOXMwRDhxIiwiSW1Gc3Z4MXNuIiwiQXJlZ3dVOEhYIiwiRzlNNmF0ZXc3IiwiV29rejlLbzhXIiwiRGhMWGY1WFdRIiwidnRmSDQyMVRKIiwiVzV5SjI4Q2xmIiwiQVplR09NZTJMIiwiRk96OWhzRjdBIiwiVnNoZzYzUmJtIiwiT3dpM1FBemprIiwibnhCOXBua09RIiwiWWF0WExVb1hPIiwidEFKczFoMThIIiwiSUZqMXg2M0RJIiwiU2UwYkV5UGVzIiwiR2RTbEtObWJrIiwiQUZnZGd4V293IiwiQUhES0FGUmFKIiwiOWFoOVFGMWZIIiwiejVJclZBSnMwIl19fQ.qEtKRZgF-wYCWGq82il_IOhYwDALnPKgT8CxsGD6VpU",
                                "userDetails": {
                                    "userId": "String",
                                    "firstName": "String",
                                    "lastName": "String",
                                    "email": "String",
                                    "mobileNumber": Number,
                                    "active": "Boolean",
                                    "groups": []
                                }
                            }
                            }
                * @apiErrorExample {json} Error-Response:
                *
                *       {
                            "error": true,
                            "message": "Login Failed",
                            "status": 500,
                            "data": null
                        }

                * @apiErrorExample {json} Error-Response:
                    *
                    *   {
                            "error": true,
                            "message": "Wrong Password.Login Failed",
                            "status": 400,
                            "data": null
                        }

    */

    app.post(`${baseUrl}/forgotPassword`, userController.forgotPassword);
    /**
                 * @apiGroup Users
                 * @apiVersion  1.0.0
                 * @api {post} /api/v1/users/forgotPassword Forgot Password.
                 *
                 * @apiParam {string} email Email of the user. (body params) (required)
                 *
                 * @apiSuccess {object} myResponse shows error status, message, http status code, result.
                 * 
                 * @apiSuccessExample {object} Success-Response:
                    {
                        "error": false,
                        "message": "User Details Found",
                        "status": 200,
                        "data": "Mail sent successfully"
                    }
                 
                * @apiErrorExample {json} Error-Response:
                *
                *       
                    {
                        "error": true,
                        "message": "User email address is missing",
                        "status": 500,
                        "data": null
                    }

    */

    app.post(`${baseUrl}/resetPassword`, userController.resetPassword);

    /**
                 * @apiGroup Users
                 * @apiVersion  1.0.0
                 * @api {post} /api/v1/users/resetPassword Reset Password Link.
                 *
                 * @apiParam {string} email Email of the user. (body params) (required)
                 *
                 * @apiSuccess {object} myResponse shows error status, message, http status code, result.
                 * 
                 * @apiSuccessExample {object} Success-Response:
                    {
                        "error": false,
                        "message": "Mail sent Successfully",
                        "status": 200,
                        "data": "Password reset successfull"
                    }
                 
                * @apiErrorExample {json} Error-Response:
                *
                *       
                    {
                        "error": true,
                        "message": "User-ID parameter is missing",
                        "status": 500,
                        "data": null
                    }

                * @apiErrorExample {json} Error-Response:
                *
                *       
                    {
                        "error": true,
                        "message": "Password is missing",
                        "status": 500,
                        "data": null
                    }


    */
    


    app.post(`${baseUrl}/logout`, userController.logout);

    /**
                 * @apiGroup Users
                 * @apiVersion  1.0.0
                 * @api {post} /api/v1/users/logout Logout.
                 *
                 *
                 * @apiSuccess {object} myResponse shows error status, message, http status code, result.
                 * 
                 * @apiSuccessExample {object} Success-Response:

                    {
                        "error": false,
                        "message": "Logged Out Successfully",
                        "status": 200,
                        "data": null
                    }                 

    */
    



}// end of setRouter

module.exports = {
    setRouter: setRouter
}