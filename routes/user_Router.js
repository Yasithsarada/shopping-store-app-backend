const express = require('express');
const { signUpUser ,signInUser, isTokenAlive } = require('../controller/userCtrl');
const router = express.Router();

router.post('/signUp' , signUpUser);
router.post('/signIn' , signInUser);
router.get('/isSessionActive' , isTokenAlive);


module.exports = router;        