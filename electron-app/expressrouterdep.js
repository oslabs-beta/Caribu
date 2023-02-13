const { analyzeDependency } = require('express-router-dependency-graph')

console.log(analyzeDependency('json', '/Users/morry/git/cs/juniorUnits/unit-9-express', '', './server', './node_modules'))