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

        },
        POST: {
 
        }
      }
    },
    {
      routeName: '/species',
      routeMethods: {
        GET: {

        }
      }
    });
});

app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log(`Listening to port: ${PORT}`);
});