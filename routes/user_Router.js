const express = require('express');
const { signUpUser ,signInUser, isTokenAlive, googleSignIn } = require('../controller/userCtrl');
const router = express.Router();

router.post('/signUp' , signUpUser);
router.post('/signIn' , signInUser);
router.post('/signInWithGoogle' , googleSignIn);
router.get('/isSessionActive' , isTokenAlive);


module.exports = router;        