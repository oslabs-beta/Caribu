const express = require('express');

const fileController = require('../controllers/fileController');
const swapiController = require('../controllers/swapiController');
const characterController = require('../controllers/characterController')
const app = require('../server');

const router = express.Router();

// ADD STARTER DATA REQUEST ROUTE HANDLER HERE
router.get("/", fileController.getCharacters, (req, res, next) => {
    res.status(200).set('Content-Type', 'text/plain').json({characters : res.locals.characters})
})

// ADD GET MORE CHARACTERS ROUTE HANDLER HERE
// (req,res,next) => {console.log("here"); next()}
router.get("/more-characters", fileController.getCharacters, swapiController.getMoreCharacters, characterController.populateCharacterPhotos, (req, res, next) => {
    console.log('inside router get, new chars coming');
    res.status(200).json({ moreCharacters : res.locals.moreCharacters });
})

module.exports = router;
