const nodeMailer = require('nodemailer');

let transporter = nodeMailer.createTransport({
    
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    //service : 'Gmail',
    auth:{
        user: 'groupchatapps@gmail.com',
        pass: 'blrdto_1994'
    }
});

let mailOptions = {
    from: '"Group Chat Application" groupchatapps@gmail.com',
    to: '',
    subject: '',
    html:''
};

let autoEmail = (reciever, message, subject) =>{

    mailOptions.to = reciever;

    mailOptions.html = message;

    mailOptions.subject = subject;

    transporter.sendMail(mailOptions, function(err, info){
        if(err){
            console.log(err);
        }else{
            console.log('Email Sent' + info.response);
        }
    });

}//end autoEmail

module.exports = {
    autoEmail: autoEmail
}
