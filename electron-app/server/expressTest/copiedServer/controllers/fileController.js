const fs = require('fs/promises');
const fsCallback = require('fs');
const path = require('path');

// helper function to create fileController error objects
// return value will be the object we pass into next, invoking global error handler
const createErr = (errInfo) => {
  const { method, type, err } = errInfo;
  return { 
    log: `fileController.${method} ${type}: ERROR: ${typeof err === 'object' ? JSON.stringify(err) : err}`,
    message: { err: `Error occurred in fileController.${method} while we were ${errInfo.type}. Check server logs for more details.` }
  };
};

const fileController = {};

/**
 ** Check out the 3 asynchronous approaches in the following middleware:
 ** fileController.getCharacters: callback pattern
 ** fileController.saveCharacter: promise chaining
 ** fileController.deleteCharacter: async/await
 */

// MIDDLEWARE FOR GETTING CHARACTERS
fileController.getCharacters = (req, res, next) => {
  console.log("inside getCharacters filecontroller")
  fsCallback.readFile(path.resolve(__dirname, '../data/characters.json'),
    'UTF-8', 
    (err, chars) => {
      if (err) return next(createErr({
          method: 'getCharacters',
          type: 'reading file',
          err,
        }));
      const parsedData = JSON.parse(chars);
      res.locals.characters = parsedData.results;
      return next();
    });
};

// MIDDLEWARE FOR SAVING NEW OR UPDATED CHARACTERS
fileController.saveCharacter = (req, res, next) => {
  // check if the correct information is on res.locals
  if (!res.locals.updates && !res.locals.newCharacter) {
    return next(createErr({
      method: 'saveCharacter',
      type: 'previous middleware error',
      err: 'incorrect info on res.locals',
    }));
  }
  // read from characters file
  fs.readFile(path.resolve(__dirname, '../data/characters.json'), 'UTF-8')
    .then(data => {
      let finalCharacter;
      const parsedData = JSON.parse(data);
      if (res.locals.updates) {
        // if we are updating, grab info from res.locals
        const { id, nickname, fav_food } = res.locals.updates;
        // get the character from our array based off its id
        const character = parsedData.results[id];
        /** NOTE: these checks are in place of defining a delete route for deleting customizations.
         * This was done to achieve simplicity in the steps of this unit 
         * and this pattern should NOT be replicated in production code. */
        if (nickname !== 'keep') character.nickname = nickname;
        if (nickname === 'delete') delete character.nickname;
        if (fav_food !== 'keep') character.fav_food = fav_food;
        if (fav_food === 'delete') delete character.fav_food;

        finalCharacter = character;
      } else if (res.locals.newCharacter) {
        // if we are saving a new character, give it an id and custom prop
        // & use what was stored on res.locals from previous middleware
        finalCharacter = {
          dbId: parsedData.results.length,
          custom: true,
          ...res.locals.newCharacter
        } // push the new character into the character array
        parsedData.results.push(finalCharacter);
      } // write updated characters to file as json
      fs.writeFile(path.resolve(__dirname, '../data/characters.json'), 
      JSON.stringify(parsedData), 'UTF-8')
        .then(() => {
          // save the newly created/updated character on res.locals
          if (res.locals.updates) res.locals.updatedCharacter = finalCharacter;
          else res.locals.newCharacter = finalCharacter;
          return next();
        }).catch(err => next(createErr({
            method: 'saveCharacter', 
            type: 'writing file', 
            err,
        })));
    }).catch(err => next(createErr({
      method: 'saveCharacter', 
      type: 'reading file', 
      err,
    })));
};

// MIDDLEWARE FOR DELETING CUSTOM CHARACTERS
fileController.deleteCharacter = async (req, res, next) => {
  try {
    // check if the correct information is on res.locals
    if (!res.locals.deleteId)
      throw {
        type: 'previous middleware error',
        err: 'incorrect info on res.locals',
      };
    // grab the id from res.locals of the character that will be deleted
    const { deleteId } = res.locals;
    // read json file for all characters
    const chars = await fs.readFile(path.resolve(__dirname, '../data/characters.json'), 'UTF-8');
    const parsedData = JSON.parse(chars);
    // grab the character based off id
    const deleted = parsedData.results[deleteId];
    // if character is not custom, throw error, invoking catch handler
    if (deleted.custom !== true) throw {
        type: 'incorrect data provided',
        err: 'character must be custom',
      };
    // delete character object from array
    parsedData.results.splice(deleteId, 1);
    // re-id remaining custom cards
    for (let i = deleteId; i < parsedData.results.length; i++) {
      parsedData.results[i].dbId = i;
    }
    // write the updated info to file
    await fs.writeFile(path.resolve(__dirname, '../data/characters.json'),
      JSON.stringify(parsedData),'UTF-8');
    // save deleted character in res.locals
    res.locals.deletedCharacter = deleted;
    return next();
  } catch (err) {
    return next(createErr({
      method: 'deleteCharacter',
      type: err.type ? err.type : 'reading/writing file',
      err: err.err ? err.err : err,
    }));
  }
};


// EXTENSION: ADD MIDDLEWARE TO GET FAVORITE CHARACTERS HERE


// EXTENSION: ADD MIDDLEWARE TO ADD A FAVORITE CHARACTER HERE


// EXTENSION: ADD MIDDLEWARE TO REMOVE A CHARACTER FROM FAVORITES HERE


// EXPORT THE CONTROLLER HERE
module.exports = fileController;
