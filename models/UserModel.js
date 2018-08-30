//importing mongoose module
const moongoose = require('mongoose')

//import schema
const Schema = moongoose.Schema

let userSchema = new Schema(

    {
          userId: {
            type: String,
            default: '',
            index: true,
            unique: true
          },
          firstName: {
            type: String,
            default: ''
          },
          lastName: {
            type: String,
            default: ''
          },
          password: {
            type: String,
            default: 'password@12345'
          },
          email: {
            type: String,
            default: ''
          },
          mobileNumber: {
            type: Number,
            default: 0
          },
          active:{
            type:Boolean,
            default:false
          },
          createdOn :{
            type:Date,
            default:""
          },

          groups :[]
    }
)


moongoose.model('UserModel', userSchema) 