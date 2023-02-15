const fetch = require('node-fetch');


const swapiController = {};

// MIDDLEWARE TO GET MORE CHARACTER DATA
swapiController.getMoreCharacterData = (req, res, next) => {
    const { id } = req.params;
    //error testing [works]
    // fetch(`https://swapi.dev/api/pd}`)
    //
    fetch(`https://swapi.dev/api/people/${id}`)
        .then((response) => response.json())
        // .then((data) => console.log("Swapi response: ", data))
        .then((data) => res.locals.charInfo = data)
        .then((data) => {
            next()})
        .catch(() => next({ message : { err: "error occurred in swapiController.getMoreCharacterData"}, log : "ERROR: Incorrect Data Recieved in swapiController.getMoreCharacterData" }))
};

// ADD MIDDLEWARE TO GET MORE CHARACTERS HERE
swapiController.getMoreCharacters = (req, res, next) => {
    // // [error testing] [works]
    // res.locals.characters = null
    if (!res.locals.characters) next({ message : { err: "error occurred in swapiController.getMoreCharacters"}, log : "ERROR: No res.locals.characters in swapiController.getMoreCharacters" })
    //grab the data from swapi
    //grab our character JSON data from getCharacters controller (invoke before this)
    let currentChars = res.locals.characters;
    // console.log(currentChars);
    let currentCharArray = [];
    currentChars.forEach(el => currentCharArray.push(el.name))
    
    //make a list of all current character names
    //iterate through swapi response
    // // [error testing] [works]
    // // fetch('https://swapi.dev/api/peop')
    // // 
    fetch('https://swapi.dev/api/people/?page=3')
        .then(response => response.json())
        // .then((data) => console.log(data.results))
        .then(data => {
            data = data.results
            const newChars = []
            for (const char in data) {
                if (!currentCharArray.includes(data[char].name)) {
                    newChars.push(data[char])
                }
            }
            return newChars;
        })
        .then((newChars) => res.locals.moreCharacters = newChars)
        .then(() => next())
        .catch(() => next({ message : { err: "error occurred in swapiController.getMoreCharacters"}, log : "ERROR: error in fetch request in swapiController.getMoreCharacterData" }))
    
        //if the name matches a name in currChars
            //continue
        //if not, its a new character
            //create a new chracter with it on res.locals
    
}

// EXPORT THE CONTROLLER HERE

module.exports = swapiController;
