const bcrypt = require("bcrypt");
const User = require("../model/user.model");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

//sign up user
const signUpUser = asyncHandler(async (req, res) => {
  try {
    console.log("heyy");
    const { username, email, password } = req.body;

    console.log(email);
    console.log(password);
    console.log(username);
    // if (!username || !email || !password) return res.status(401).send({ message: "Please fill out all the fields!" });
    if (!username || !email ) return res.status(401).send({ message: "Please fill out all the fields!" });
    console.log("1");
    if (!validateEmail(email)) {
      console.log("email returned");
       return res.status(400).json("Enter valid email");
    }

    // if (password.length < 8) return res.status(401).send({ message: "Password should be a least 8 charctors long!" });

    const user = await User.findOne({ email });

    if (user) return res.status(400).json("User already exists with this email");

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
      googleId : "",
      imageUrl: ""
    });
    if (!newUser)  return res.status(401).send({ message: "User not succeccessfully created !" });
    console.log("new user " +newUser)
    if (newUser) return res.status(200).json({
        user: newUser,
        // username: newUser.userName,
        // email: newUser.email,
        // password: newUser.password,
        // token: generateActivationToken(newUser._id),
      });
  } catch (error) {
    // res.status(400).send({ message: "something went wrong" });
    return res.status(400).json({ message: error.message });
  }
});

//sign in user
const signInUser = asyncHandler(async (req, res) => {
  try {
    console.log("signnnn");
    const { email, password } = req.body;
    console.log({ email });
    const user = await User.findOne({ email });
    console.log(user);
    if (!user)
      return res
        .status(401)
        .json({ message: "user not found..Plaese Sign up and login !" });

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched)
      return res
        .status(401)
        .json({ message: "Incorrect username or password !" });

    const token = generateActivationToken(user._id);
console.log(token)
    if (!token)
      return res
        .status(401)
        .json({ message: "Something went wrong..Plaese try again !" });
console.log({ token, ...user._doc })
   return res.status(200).json({ token, ...user._doc });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "user not found..Plaese Sign up and login !" });
  }
});

const isTokenAlive = asyncHandler(async (req, res) => {
  console.log("here iisUserActive calledd")
  try {
    const token = req.header("x-auth-token");
    
    console.log("token : "+token)
    // console.log(first)
    if (!token || token == "" ) return res.status(401).json({ message: "Log in again!" });

    jwt.verify(
      token,
      process.env.JWT_SECRET_ACTIVATION_KEY,
      async (error, decodedUser) => {
        if (error) return res.status(401).json({ message: error.message });

        if(!decodedUser) return res.status(401).json({ message: "Session Expired.Login in again" });
        
        const user = await User.findById(decodedUser.id);
        if (!user) return res.status(401).json({ message: "Invalid Login..Please Log in again!" });
        
        return res.status(200).json({token , ...user._doc});
      }
    );
    // console.log(deecodedUser)
    // const user = await User.findById(deecodedUser.id);
    //  res.status(200).json(user)
  } catch (error) {
    return res.status(400).json({ error: error });
  }
});


//SIGN IN WITH GOOGLE
const googleSignIn = asyncHandler(async (req, res) => {
  try {
    console.log("heyy");
    const { username, email, password , googleId , imageUrl} = req.body;

    console.log(email);
    console.log(password);
    console.log(username);
    console.log(googleId);
    console.log(imageUrl);
    // if (!username || !email || !password) return res.status(401).send({ message: "Please fill out all the fields!" });
    // if (!email ) return res.status(401).send({ message: "Please fill out all the fields!" });
    console.log("1");
    if (!validateEmail(email)) {
      console.log("email returned");
       return res.status(400).json("Enter valid email");
    }

    // if (password.length < 8) return res.status(401).send({ message: "Password should be a least 8 charctors long!" });

    // const user = await User.findOne({ email });
    const user = await User.findOne({googleId : googleId});

    // if (user) return res.status(400).json("User already exists with this email");   //send the token
    if (!user) {
      const newUser = await User.create({
        username: username,
        email: email,
        // password: hashedPassword,
        googleId: googleId,
        imageUrl : imageUrl
      });
      if (!newUser)  return res.status(401).send({ message: "User not created !" });
      
      const token = generateActivationToken(newUser._id);
      console.log("new user " +newUser)
     
      if (!token)  return res.status(401).json({ message: "Something went wrong..Plaese try again !" });
      console.log({ token, ...newUser._doc })
      return res.status(200).json({ token, ...newUser._doc });
    }   //send the token
    

    // const salt = await bcrypt.genSalt(12);
    // const hashedPassword = await bcrypt.hash(password, salt);

    // const newUser = await User.create({
    //   username: username,
    //   email: email,
    //   // password: hashedPassword,
    //   googleId: googleId,
    //   imageUrl : imageUrl
    // });
    
    // if (!newUser)  return res.status(401).send({ message: "User not created !" });
    const token = generateActivationToken(user._id);
    // console.log("new user " +newUser)
    // if (newUser) return res.status(200).json({
    //   user: newUser,
        
    //   });
      if (!token) return res.status(401)
          .json({ message: "Something went wrong..Plaese try again !" });
  console.log({ token, ...user._doc })
     return res.status(200).json({ token, ...user._doc });
  } catch (error) {
    // res.status(400).send({ message: "something went wrong" });
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
});


const validateEmail = (email) => {
  console.log(
    "email validation :" +
      String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
  );
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const generateActivationToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET_ACTIVATION_KEY, {
    expiresIn: "3m",
  });
};
module.exports = {
  signUpUser,
  signInUser,
  isTokenAlive,
  googleSignIn
};
