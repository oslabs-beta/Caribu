const express = require('express');

const characterController = require('../controllers/characterController');
const fileController = require('../controllers/fileController');
const swapiController = require('../controllers/swapiController');

const router = express.Router();
// console.log(characterController)

// ADD GET MORE CHARACTER DATA ROUTE HANDLER HERE

router.get('/:id', swapiController.getMoreCharacterData, (req, res, next) => {
    res.status(200).json(res.locals.charInfo);
    // next(err)
}) 
// ADD POST NEW CHARACTER ROUTE HANDLER HERE
router.post('/', characterController.createCharacter, fileController.saveCharacter, (req, res) => {
    console.log('got to post! char is: ', res.locals);
     res.status(200).send(res.locals.newCharacter);
})

// ADD UPDATE CHARACTER ROUTE HANDLER HERE
router.patch("/:id", characterController.updateCharacter, fileController.saveCharacter, (req, res) => {
    res.status(200).json(res.locals.updatedCharacter)
})

// ADD DELETE CHARACTER ROUTE HANDLER HERE
router.delete('/:id', characterController.deleteCharacter, fileController.deleteCharacter, (req, res) => {
    console.log(req);
    res.status(200).json(res.locals.deletedCharacter);
})


// router.delete(":/id", characterController.deleteCharacter, fileController.deleteCharacter, (req, res) => {
//     console.log(res.locals);
//     res.status(200).json(res.locals.deletedCharacter);
// })

// EXPORT THE ROUTER
module.exports = router;
