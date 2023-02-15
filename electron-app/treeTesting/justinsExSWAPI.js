const db = require("../models/starWarsModels");
//comment example
const starWarsController = {};

const fetch = require("node-fetch");

const testNum = 12;
let bruh = 5 + testNum;
const testStringOuter = "OUTER";

// class ClassTester {
//   constructor(val) {
//     this.value = val;
//     this.valTwice = `${val} and ${val} again`;
//   }
//   get area() {
//     return this.returnValHello();
//   }
//   // Method
//   calcArea() {
//     return this.value + "HELLOOOOOOO";
//   }
//   *getSides() {
//     yield this.value;
//     yield this.valTwice;
//   }
// }

// const outerClass = new ClassTester(testStringOuter);

starWarsController.getCharacters = function coolAnon(req, res, next) {
  testNum++;
  const awsObj = {};
  //comment 2
  awsObj.req = req.body;
  awsObj.res = res;
  const testStringInner = "INNER";
  const innerClass = new ClassTester(testStringInner);
  console.log("in getCahr");
  fetch("https://5z7fvxgfqqjpyyyybl6uc2igxi0wmyqs.lambda-url.us-east-1.on.aws/")
    .then((data) => data.json())
    // .then(data => data.body)
    .then((data) => console.log("data.body jsonified from AWS", data))
    .then(() => next());
};

starWarsController.getSpecies = function speciesGetter(req, res, next) {
  // write code here
  const reqID = req.query.id;
  const text =
    "SELECT species._id, species.classification, species.average_height, species.average_lifespan, species.language, species.name, planets.name AS homeworld FROM species LEFT OUTER JOIN planets ON species.homeworld_id = planets._id WHERE species._id = $1;";
  const values = [reqID];
  db.query(text, values)
    .then((data) => data.rows[0])
    .then((data) => (res.locals.species = data))
    .then(() => next())
    .catch({
      message: { err: "ERROR - API call failed" },
      log: "ERROR in starWarsController.getSpecies",
    });
};

function testNamedFunc(anyVar) {
  testNum++;
  let newString = anyVar + "jujjj";
  return newString;
}

module.exports = starWarsController;
