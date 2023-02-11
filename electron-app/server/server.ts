//This is not the true backend, it is simply a server for front end testing.

const express = require('express');
const path = require('path');
const app = express();

const PORT = 3000;

/**
 * handle parsing request body
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//at homepage - on endpoint main, send main page to front end
app.get('/routes', (req, res) => {
  res.json(
    {
      routeName: '/character',
      routeMethods: {
        GET: {
          middlewares: [{
            functionInfo: {
              funcName: 'getCharacters',
              funcFile: '/Users/melodyduany/Documents/Codesmith/unit-10-databases/server/controllers/starWarsController.js',
              funcPosition: [6, 40],
              funcDef: 'lorem ipsum dolor sit amet',
            }
          }]
        },
        POST: {
          middlewares: [{
            functionInfo: {
              funcName: 'addCharacter',
              funcFile: '/Users/melodyduany/Documents/Codesmith/unit-10-databases/server/controllers/starWarsController.js',
              funcPosition: [102, 119],
              funcDef: 'tbh i dont know hehe',
            }
          }]
        }
      }
    },
    {
      routeName: '/species',
      routeMethods: {
        GET: {
          middlewares: [{
            functionInfo: {
              funcName: 'getCharacters',
              funcFile: '/Users/melodyduany/Documents/Codesmith/unit-10-databases/server/controllers/starWarsController.js',
              funcPosition: [6, 40]
            }
          }]
        }
      }
    });
});

app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log(`Listening to port: ${PORT}`);
});