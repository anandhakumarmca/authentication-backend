const User = require("../models/User");
const { sendMail } = require("./SendMail");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const verifyUser = require("../models/verifyUser");
dotenv.config();

async function InsertVerifyUser(name, email, password) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const token = generateToken(email);

    const newUser = new verifyUser({
      name: name,
      email: email,
      password: hashedPassword,
      token: token,
    });

    const activationLink = `https://auth-be-u82g.onrender.com/signin/${token}`;
    const content = `<h4>Hi, there </h4>
        <h5>Welcome to the App </h5>
        <p>Thank you for signing Up! Click on the below link to activate.</p>
        <a href="${activationLink}">Click here!</a>
        <p>Regards</p>
        <p>Team</p>`;

    await newUser.save();

    sendMail(email, "VerifyUser", content);
  } catch (error) {
    console.log(error);
  }
}

function generateToken(email) {
  return jwt.sign({ email: email }, process.env.signup_Secert_Token);
}

async function InsertSignupUser(token) {
  try {
    const userVerify = await verifyUser.findOne({ token: token });
    if (userVerify) {
      const newUser = new User({
        name: userVerify.name,
        email: userVerify.email,
        password: userVerify.password,
        forgetPassword: {},
      });
      await newUser.save();
      await userVerify.deleteOne({ token: token });
      const content = `<h4>Registration successful</h4>
        <h5>Welcome to the App </h5>
        <p>You are successfully registered.</p>
        <p>Regards</p>
        <p>Team</p>`;
      sendMail(newUser.email, "Registration successful", content);
      return content;
    }
    return `<h4>Registration Failed</h4>
    <h5>Link expired.... </h5>
    <p>Regards</p>
    <p>Team</p>`;
  } catch (error) {
    console.log(error);
    return `
        <html>
        <body>
        <h4>Registration Failed</h4>
        <h5>Unexpected error happened.....</h5>
        <p>Regards</p>
        <p>Team</p>
        </body>
        </html>`;
  }
}

module.exports = { InsertVerifyUser, InsertSignupUser };
