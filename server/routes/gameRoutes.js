const express = require('express')
const router = express.Router()
const gameController = require('../controllers/gameController')
const verifyJWT = require('../middleware/verifyJWT')


//router1.use(verifyJWT)
//router2.use(verifyJWT)

router.route('/')
    .get(gameController.getAllGames)
    .post(gameController.createNewGame)
    .patch(gameController.updateGame)
    .delete(gameController.deleteGame)

router.route('/joined')
    .get(gameController.getAllGamesJoined)
    .patch(gameController.updateGameUser)

router.route('/leave')
    .patch(gameController.updateLeaveGame)


module.exports = router