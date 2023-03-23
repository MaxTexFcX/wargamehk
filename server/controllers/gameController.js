const Wargame = require('../models/Wargame')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

//@dase Get all games
//@route GET /games
//@access Private
const getAllGames = asyncHandler(async (req, res) => {

    const games = await Wargame.find().select().lean()

    if (!games?.length) {
        return res.status(400).json({ message: 'No game found' })
    }
    res.json(games)
})

//@dase Get all games
//@route GET /games
//@access Private
const getAllGamesJoined = asyncHandler(async (req, res) => {

    const games = await Wargame.find().select('joined').lean()

    if (!games?.length) {
        return res.status(400).json({ message: 'No game found' })
    }
    res.json(games)
})

//@dase Create new game
//@route POST /games
//@access Private

const createNewGame = asyncHandler(async (req, res) => {
    const { createdby, hosters, title, date, location, joule, maxpeople, joined, allow, deny, price, studentprice, rentgear, gamemode, public, password, active } = req.body

    if (!createdby || !Array.isArray(hosters) || !title || !date || !location || !joule || !maxpeople || !Array.isArray(joined) || !Array.isArray(allow) || !Array.isArray(deny) || !price || !studentprice || !rentgear || !Array.isArray(gamemode) || !public || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required ' })
    }

    if (!password) {
        const gameObject = { createdby, hosters, title, date, location, joule, maxpeople, joined, allow, deny, price, studentprice, rentgear, gamemode, public, active }

        // Create and store new game
        const game = await Wargame.create(gameObject)

        if (game) {
            return res.status(201).json({ message: `${hosters} game has been created` })
        } else {
            return res.status(400).json({ message: 'Invalid user date received' })
        }
    }

    // Hash password
    const hashedPwd = await bcrypt.hash(password, 10)
    const gameObject = { createdby, hosters, title, date, location, joule, maxpeople, joined, allow, deny, price, studentprice, rentgear, gamemode, public, "password": hashedPwd, active }

    const game = await Wargame.create(gameObject)

    if (game) {
        res.status(201).json({ message: `${hosters} game has been created` })
    } else {
        res.status(400).json({ message: 'Invalid user date received' })
    }
})

//@dase Update a games
//@route PATCH /games
//@access Private

const updateGame = asyncHandler(async (req, res) => {
    const { id, createdby, hosters, title, date, location, joule, maxpeople, allow, deny, price, studentprice, rentgear, gamemode, public, password, active } = req.body

    // Config date 
    if (!createdby || !Array.isArray(hosters) || !title || !date || !location || !joule || !maxpeople || !Array.isArray(allow) || !Array.isArray(deny) || !price || !studentprice || !rentgear || !Array.isArray(gamemode) || !public || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required ' })
    }

    const game = await Wargame.findById(id).exec()

    if (!game) {
        return res.status(400).json({ message: 'Game not found' })
    }

    // Allow updates to the original user
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    game.createdby = createdby
    game.hosters = hosters
    game.title = title
    game.date = date
    game.location = location
    game.joule = joule
    game.maxpeople = maxpeople
    game.allow = allow
    game.deny = deny
    game.price = price
    game.studentprice = studentprice
    game.rentgear = rentgear
    game.gamemode = gamemode
    game.public = public
    game.active = active

    if (password) {
        //Hash password
        game.password = await bcrypt.hash(password, 10) //salt rounds
    }

    const updatedGame = await game.save()

    res.json({ message: "The game hsa been updated" })
})

//@dase Update a games user
//@route PATCH /games/joined
//@access Private

const updateGameUser = asyncHandler(async (req, res) => {
    const { id, player } = req.body

    // Config date 
    if (!id || !player) {
        return res.status(400).json({ message: 'All fields are required ' })
    }

    const game = await Wargame.findById(id).exec()

    if (!game) {
        return res.status(400).json({ message: 'Game not found' })
    }

    const duplicateUser = await Wargame.findById(id).where('joined').equals(player).exec()

    if(duplicateUser) {
        return res.status(409).json({ message: 'DuplicateUser User' })
    }

    const updatedGame = await Wargame.updateOne(
        { _id: id },
        { $push: { joined: player } }
    );

    res.json({ message: "The game hsa been updated" })
})

//@dase Update a games user
//@route PATCH /games/joined
//@access Private

const updateLeaveGame = asyncHandler(async (req, res) => {
    const { id, player } = req.body

    // Config date 
    if (!id || !player) {
        return res.status(400).json({ message: 'All fields are required ' })
    }

    const game = await Wargame.findById(id).exec()

    if (!game) {
        return res.status(400).json({ message: 'Game not found' })
    }

    const findUser = await Wargame.findById(id).where('joined').equals(player).exec()

    if(!findUser) {
        return res.status(409).json({ message: `${player} not in this game` })
    }

    const updatedGame = await Wargame.updateOne(
        { _id: id },
        { $pull: { joined: player } }
    );

    res.json({ message: "The game hsa been updated" })
})

//@dase Delete a user
//@route DELETE /users
//@access Private
const deleteGame = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'Game ID Required' })
    }

    const game = await Wargame.findById(id).exec()

    if (!game) {
        return res.status(400).json({ message: 'Game not found' })
    }

    const result = await game.deleteOne()

    res.json({ message: "The game has been deleted" })
})

module.exports = {
    getAllGames,
    createNewGame,
    updateGame,
    deleteGame,
    getAllGamesJoined,
    updateGameUser,
    updateLeaveGame
}