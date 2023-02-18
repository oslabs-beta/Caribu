## Directory Processing

1. Get Express App object (EAO) from OSD (our server directory) (they may need to throw module.exports = app into bottom of server file)
2. Copy it fully to a new dir (copyOSD)
    1. Parse everything to name all functions
3. Get the EAO from the copyOSD
4. Make sure they line up
5. Construct top level of frontend obj

## Workflow: 
1. Copy the server directory to a new one (shell command?) (or maybe recursive copy thing) 
  - This is currently a manual process
  - We can ask the user to do it prior to import/drop-in or we could do it through either
    A. a shell command
    B. a recursive copy function in JS, which probs def be slower
2. Put a `module.exports = app` at the bottom of main express server file (maybe can have ppl do this)
3. run renameAllFuncs to get a copied version of the app dir
  - Rename all funcs uses `arrowToNamed.js` as the plugin for renaming. this plugin ONLY renames arrow functions. We need to control for regular anonymous functions as well, as well as named functions. Named function changing will also probably require the logic for the name parsing in `mergeTrees.js` to change as well.
4. run `getOriginalExpressAppObj.js` and `getRenamedExpressAppOb.js` BUT NOT CONCURRENTLY, these will create mirrored tree `.json` files that we will use in the next step.
  - You have to start each one to get the express app obj but end them before you run the other because they'll try to use the same server/connections if so
  - Idk the best way to do this, maybe with a file that awaits the listen event on both of them or something
5. run `mergeTrees.js` which will 
  - Still need to make this formatting match the object the FE is expecting
  - Still need to integrate Justin's variable functions
  - Bunch of things could be fixed on the `FuncObj` class. Namely:
    A. 


Files: 
- `renameAllFuncs`:
  - We need to standardize how to reference original directory path and new directory path
  - The plugin it uses renames arrow functions. We need to control for regular anonymous functions as well, as well as named functions. Named function changing will also probably require the logic for the name parsing in `mergeTrees.js` to change as well.
  - Big bottleneck - currently this only processes .js files. We should look into how well it does with ts ones.
    - That may not be a huge issue if the express thing just compiles it for us
    - This will be the one of the main hurdles for adding support for more frameworks (eg. Svelte)

- `getOriginalExpressAppObj` and `getRenamedExpressAppObj`
  - .ts files throw a lot of errors but they compile fine
  - reason for the errors is that we need to define the objects more, bleh

- `mergeTrees`
  - `FuncObject` class
    - need to fix `listUpdates`
      1. Idk what's happening with it, I don't remember what the use of the conditional chain is, hmu to go over it
      2. I think we can change the `listUpdates` method's second conditional (the one which checks if we are udpating an `AssignmentExpression`) to both recur + clean up how we show the updating of specific properties on objects
    - need to fix `listDeclares`
      - I don't want to take out parameters, but there is no real reason for them to count as 'declared' because they are not used elsewhere by the same name. Maybe we should make them a separate field on the funcObject
    - add multiple return functionality to `listReturns`
  - `mergeTrees` func in `mergeTrees` 
    - needs to include bound dispatchers too bc they can also use middleware and have stacks. Should be annoying but basically identical to what we do now.
  - `getFuncInfo` function could probably be a lot more efficient. Currently traverses the same AST looking for three different types of functions, of which it will only really need one. Maybe store the original type of function (eg. was it an arrow, a named function, or an anonymous function) in the name?



