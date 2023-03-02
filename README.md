![alt text](./electron-app/assets/7.png)

# Caribu

Caribu is a micro-service migration planning tool for Express applications.

## Installation

Follow the instructions on https://Caribujs.com to install Caribu.

<!-- Picture of landing page here -->

## Usage

To use our application, first copy our script and run it in your terminal.
<a href="https://imgur.com/OBR5MK0"><img src="https://i.imgur.com/OBR5MK0.png" title="source: imgur.com" /></a><a href="https://imgur.com/QId5FHU"><img src="https://i.imgur.com/QId5FHU.png" title="source: imgur.com" /></a>

Once our server is up and running as displayed above, simply drag and drop your applications server folder, then specify the absolute paths to your server file and node modules folder, then submit!

<!-- Picture of welcome page pointing at drop folder, and inputs -->
<img src="https://media.giphy.com/media/StAJVBQbbS5vRukVuH/giphy.gif" width="70%" height="70%"/>

Once your application has been parsed by Caribu (which may take a moment as we make a copy of your entire server), you will be able to view the applications functionality in the Route Explorer and Purity Overview.

The Route explorer tab displays all of the individual routes in your application. When a route is clicked, it will display all the functions in that specific route. Each function is also able to be individually clicked which will then display a list of dependencies for that specific function.

<!-- Picture of route explorer in use -->
<img src="https://media.giphy.com/media/b9vPsobQ2B5bNQ6zoq/giphy.gif" width="70%" height="70%"/>

The Purity Overview tab displays the smallest possible breakdown of your applications routes. Each route will display its corresponding middleware and highlight middleware that is not pure. You also have the option to filter out certain middleware as you see fit.

<!-- Picture of Purity Overview -->
<img src="https://media.giphy.com/media/qgBGBGDGsNDLGTTT3m/giphy.gif" width="70%" height="70%"/>

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
