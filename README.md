![alt text](./electron-app/assets/6.png)

# Caribu

Caribu is a micro-service migration planning tool for Express applications.

## Installation

Follow the instructions on https://Caribujs.com to install Caribu.

<!-- Picture of landing page here -->

## Usage

To use our application you would begin by dropping in your applications server folder.

Then specify the absolute route to both your node modules folder and main server file.

<!-- Picture of welcome page pointing at drop folder, and inputs -->

Once your application has been parsed by Caribu, you will be able to view the applications functionality in the Route Explorer, Metrics, and Purity Overview.

The Route explorer tab displays all of the individual routes in your application, which when clicked, will display all the functions in that specific route. Each function is also able to be individually clicked which will then display a list of dependencies for that specific function

<!-- Picture of route explorer in use -->

The Metrics tab allows you to display a graph of either all the controllers or API's in your application.
For instance if we chose controllers, the graph would display the amount of external dependencies, the amount of enclosed variables, and finally a percentage of how pure the functions is, for each and every controller.

Each controller is also clickable rendering a tab which will offer suggestions on how to refractor that controller into a pure function.

<!-- Picture of metrics tab in use -->

The Purity Overview tab displays the smallest possible breakdown of your applications routes. Each route will display its corresponding middleware and highlight middleware that is not pure.

<!-- Picture of Purity Overview -->

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
