const { convertToPhotoUrl } = require('../utils/helpers');

const characterController = {};

// ADD MIDDLEWARE TO CREATE CHARACTER HERE
characterController.createCharacter = (req, res, next) => {
        const { name, height, birth_year, hair_color, skin_color, eye_color } = req.body
        const charObj = {name, height, birth_year, hair_color, skin_color, eye_color}
        // console.log("this is charObj: ", charObj)
        for (const trait in charObj) {
            // console.log("our trait is, ", charObj[trait]);
            if (!charObj[trait]) next({message: {err: 'characterController.createCharacter -- Incorrect data type'}, log: 'Error inside characterController.createCharacter'})
        }
        res.locals.newCharacter = charObj;
        // console.log("new char locals is : ", res.locals.newCharacter)
    next();
 }

 console.log("this is character controller", characterController)

// ADD MIDDLEWARE TO UPDATE CHARACTER NICKNAME HERE
characterController.updateCharacter = (req, res, next) => {
    const id = req.params.id
    const { nickname, fav_food } = req.body;
    res.locals.updates = { nickname, fav_food, id }
    for (const traits in res.locals.updates) {
        if (!res.locals.updates[traits]) next({ message: { err: 'characterController.updateCharacter: ERROR: Incorrect data received' }, log: 'ERROR: Incorrect Data Recieved in update. Missing a trait to update' });
    }
    next();
}

// ADD MIDDLEWARE TO DELETE CHARACTER HERE
characterController.deleteCharacter = (req, res, next) => {
    console.log("in delete Char")
    const id = req.params.id;
    res.locals.deleteId = id;
    console.log("in character delete controller: " , res.locals)
    if (!id) next({ message: { err: 'characterController.deleteCharacter: ERROR: no ID received' }, log: 'ERROR: Incorrect Data Recieved in characterController.delete' });
    next();
}

// ADD MIDDLEWARE TO ADD CHARACTER PHOTOS HERE
characterController.populateCharacterPhotos = (req, res, next) => {
    if (!res.locals.moreCharacters) next({ message: { err: 'characterController.populateCharacterPhoots: ERROR: no list of characters received' }, log: 'ERROR: Incorrect Data Recieved in characterController.populateCharacterPhotos' })
    res.locals.moreCharacters.forEach(el => {
        let photoURL = convertToPhotoUrl(el.name)
        el.photo = photoURL
    })
    next()
}

// EXPORT THE CONTROLLER
module.exports = characterController;

// console.log(module.export)