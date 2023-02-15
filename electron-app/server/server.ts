//This is not the true backend, it is simply a server for front end testing.

const express = require('express');
const path = require('path');
const app = express();

const PORT = 3000;
``
/**
 * handle parsing request body
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//at homepage - on endpoint main, send main page to front end

//req.body will have the serverDir and the serverFile
  //copy full server from filepath (shell command?
  //clone the copied server to a renamed server
  //get the express app obj of both sevrers (might require a shell command)
  //run mergeTrees and send the finalObj back as a response


app.post('/routes', (req, res) => {
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