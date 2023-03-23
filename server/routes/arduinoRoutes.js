const express = require('express')
const router = express.Router()
const arduinoController = require('../controllers/arduinoController')
const verifyJWT = require('../middleware/verifyJWT')

router.route('/')
    .get(arduinoController.On)
    .post(arduinoController.Off)



module.exports = router