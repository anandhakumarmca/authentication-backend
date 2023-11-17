const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config()
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.nodemailer_user,
    pass: process.env.nodemailer_pass,
  },
});

function sendMail(toEmail,subject,content){
    const mailOptions = {
        from: "learnwithanandh@gmail.com",
        to:toEmail,
        subject:subject,
        html:content
    };
    console.log("info1", process.env.nodemailer_user);
    console.log("info2", process.env.nodemailer_pass);
    transporter.sendMail(mailOptions,(error,info)=>{
        if(error){
            console.log("error occured", error);
        }else{
            console.log("Email sent",info.response);
        }
    })
}

module.exports = {sendMail};