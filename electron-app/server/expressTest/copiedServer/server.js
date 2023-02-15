const path = require('path');
const express = require('express');

const app = express();
const PORT = 3000;


const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/hiiiiii');


const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true}
});

const User = mongoose.model('User', userSchema)

User.create({ username : "chris", password : "olmsted" }, (err, users) => {
  console.log("users", users)
  if (err) console.log("error in create")
  // if (err) return next('Error in userController.createUser: ' + JSON.stringify(err));
  // res.locals.userID = users.id
  // return next()
})

User.create({ username : "meg", password : "schneider" }, (err, users) => {
  console.log("users", users)
  if (err) console.log("error in create")
  // if (err) return next('Error in userController.createUser: ' + JSON.stringify(err));
  // res.locals.userID = users.id
  // return next()
})

User.find({}, (err, users) => {
  // if a database error occurs, call next with the error message passed in
  // for the express global error handler to catch
  console.log("users", users)
  if (err) console.log("error in find")
  
  // store retrieved users into res.locals and move on to next middleware
});

app.use(express.json())
// app.use(express.static('../client'))
/**
 * require routers
*/
const apiRouter = require('./routes/api.js')
const characterRouter = require('./routes/characters.js')


/**
 * handle parsing request body
*/


/**
 * handle requests for static files
*/
app.use(express.static(path.join(__dirname, '../client/assets')));


/**
 * define route handlers
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '../client/index.html'));
})
app.use('/api/characters', characterRouter);
app.use('/api', apiRouter);



// route handler to respond with main app


// catch-all route handler for any requests to an unknown route
app.use('*', (req, res) => {

  res.sendStatus(404);
})

/**
 * configure express global error handler
 * @see https://expressjs.com/en/guide/error-handling.html#writing-error-handlers
 */

app.use((err, req, res, next) => {
  const defaultError = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occurred' }, 
  }

  let errorObj = Object.assign({} , defaultError, err);
  console.log("this is errorObj: ", errorObj)
  res.status(errorObj.status).json(errorObj.message)
  
})



/**
 * start server
 */
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = app;
