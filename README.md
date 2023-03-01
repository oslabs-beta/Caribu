![alt text](./electron-app/assets/7.png)

# Caribu

Caribu is a micro-service migration planning tool for Express applications.

## Installation

Follow the instructions on https://Caribujs.com to install Caribu.

<!-- Picture of landing page here -->

## Usage

To use our application you would begin by dropping in your applications server folder.

Then specify the absolute route to both your node modules folder and main server file.

<!-- Picture of welcome page pointing at drop folder, and inputs -->
<img src="https://media.giphy.com/media/Uza1zjD6CJ3WUIHcmn/giphy.gif" width="70%" height="70%"/>

Once your application has been parsed by Caribu, you will be able to view the applications functionality in the Route Explorer and Purity Overview.

The Route explorer tab displays all of the individual routes in your application. When a route is clicked, it will display all the functions in that specific route. Each function is also able to be individually clicked which will then display a list of dependencies for that specific function.

<!-- Picture of route explorer in use -->
<img src="https://media.giphy.com/media/2BRQC0mqAYrmqLksXI/giphy.gif" width="70%" height="70%"/>

The Purity Overview tab displays the smallest possible breakdown of your applications routes. Each route will display its corresponding middleware and highlight middleware that is not pure.

<!-- Picture of Purity Overview -->
<img src="https://media.giphy.com/media/DTI9mrUb8uJZ9lfQo8/giphy.gif" width="70%" height="70%"/>

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
