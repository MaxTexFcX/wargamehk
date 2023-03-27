const express = require('express')
const router = express.Router()
const arduinoController = require('../controllers/arduinoController')
const verifyJWT = require('../middleware/verifyJWT')

router.route('/')
    .get(arduinoController.On)
    .post(arduinoController.Off)

router.route('/timer/ports')
    .get(arduinoController.GetPath)

router.route('/connect/:port')
    .get(arduinoController.SetPath)

module.exports = router