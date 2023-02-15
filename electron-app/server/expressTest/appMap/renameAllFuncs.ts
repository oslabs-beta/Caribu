const acorn = require("acorn");
const walk = require("acorn-walk");
const fs = require("fs");

let counter = 0;
// babel modules
const parser = require('@babel/parser')
const generate = require('@babel/generator').default
// const { default } = generate
// this is some weird require vs. import thing.
// see https://github.com/babel/babel/issues/13855
const  _traverse = require('@babel/traverse')
const traverse = _traverse.default;
// 


// this is the main transform function. It takes code, parses it, renames all its arrow functions, transforms it back into code, and returns it
const babelTransform = (code : string, filePath : string) : string => {

  // assign replace the value of using the `arrowToNamed` plugin on the passed in code. Which will return an object of which we only want code for now. 
  let replace : string  = require("@babel/core").transformSync(code, {
    plugins: [["./arrowToNamed", {
        "fileName" : filePath
    }]],
    comments : true,
    retainLines : true,
  }).code;

  // console.log(replace)
  // return replace.cod

  //return it
  return replace


}


const oldDirectoryPathOG : string = "../copiedServer";
const newDirectoryPath : string = "../copiedServerNamed";


//process the directory recursively
const processDirectory = (oldDirectoryPath : string) => {
  
  //if error, give error
  fs.readdir(oldDirectoryPath, (error : any, files : any) => {
    if (error) {
      console.error(`Error reading directory: ${error}`);
      return;
    }
  
  // make a matching path in the new directory to match that of the old directory
  // this make sure we retain directory structure as we go down its folder trees
  const newDirectorySubPath : string = oldDirectoryPath.replace(oldDirectoryPathOG, newDirectoryPath)
  console.log(newDirectorySubPath)
    //for each file
    files.forEach((fileName : string) => {
      //make its old and new filePaths
      const oldFilePath : string = `${oldDirectoryPath}/${fileName}`;
      const newFilePath : string = `${newDirectorySubPath}/${fileName}`
      
      //check info about the file
      fs.stat(oldFilePath, (error : any, stat : any) => {
        //if there's an error, give an error
        if (error) {
          console.error(`Error getting file stats: ${error}`);
          return;
        }
        //if it's a directory (folder) and not a file, then we want to recursively process the files/folders in it
        if (stat.isDirectory()) {
          console.log(oldFilePath + " is a directory")
          console.log(newFilePath)
          //make a new folder where none exists
          fs.mkdirSync(newFilePath)
          //recursively process files
          processDirectory(oldFilePath);
        } 
        //else, if its a js file, then process it
        //THIS IS A BIG BOTTLENECK VVVVV -- if we want to support anything other than js (like .ts, .svelte, etc. this is where we gotta start)
        else if (fileName.endsWith(".js")) {
          //get the file
          fs.readFile(oldFilePath, "utf-8", (error : any, code : string) => {
            //if error, give error
            if (error) {
              console.error(`Error reading file: ${error}`);
              return;
            }
            //make a clean filepath for the babel parser
            let cleanFilePath : string = oldFilePath.replaceAll("/", '$').replaceAll(".", '_')
            cleanFilePath = cleanFilePath.slice(1)

            //invoke the transform and give the result to modified code
            const modifiedCode = babelTransform(code, cleanFilePath);

            console.log(`writing '${oldFilePath}' to '${newDirectorySubPath}' `)
            fs.writeFile(newFilePath, modifiedCode, (error : any) => {
              if (error) console.error(`Error writing file: ${error}`);
            });
          });
        }
      });
    });
  });
};

processDirectory(oldDirectoryPathOG)
