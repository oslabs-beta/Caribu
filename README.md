![alt text](./electron-app/assets/7.png)

# Caribu

Caribu is a micro-service migration planning tool for Express applications.

## Installation

If you would like run our application in production mode, please follow the instructions on Caribujs.com

If you would like to run our application in development mode, please clone our repo to get started and make sure to run `npm install` to install all the necessary dependencies, then simply change directory into the electron-app folder using `cd /electron-app`. Finally run the `npm start` script to begin running the application.

<!-- Picture of landing page here -->

## Usage

To use our application, first copy our script and run it in your terminal.

<div style="display:flex; flex-direction: column; align-items: center">
<img style="width: 350px;" src="https://i.imgur.com/OBR5MK0.png" title="source: imgur.com" /><img style="width: 350px" src="https://i.imgur.com/QId5FHU.png" title="source: imgur.com" /></div>

Once our server is up and running as displayed above, simply drag and drop your applications server folder, then specify the absolute paths to your server file and node modules folder, then submit!

<!-- Picture of welcome page pointing at drop folder, and inputs -->
<img style="margin-left: 50%; margin-right: 50%;" src="https://media.giphy.com/media/StAJVBQbbS5vRukVuH/giphy.gif" width="70%" height="70%"/>

Once your application has been parsed by Caribu (which may take a moment as we make a copy of your entire server), you will be able to view the applications functionality in the Route Explorer and Purity Overview.

The Route explorer tab displays all of the individual routes in your application. When a route is clicked, it will display all the functions in that specific route. Each function is also able to be individually clicked which will then display a list of dependencies for that specific function.

<!-- Picture of route explorer in use -->
<img style="margin-left: 50%; margin-right: 50%;" src="https://media.giphy.com/media/b9vPsobQ2B5bNQ6zoq/giphy.gif" width="70%" height="70%"/>

The Purity Overview tab displays the smallest possible breakdown of your application's routes. Each route will display its corresponding middleware and highlight middleware that is not pure. You also have the option to filter out any middleware as you see fit using the tag input box.

<!-- Picture of Purity Overview -->
<img style="margin-left: 50%; margin-right: 50%;" src="https://media.giphy.com/media/qgBGBGDGsNDLGTTT3m/giphy.gif" width="70%" height="70%"/>

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
