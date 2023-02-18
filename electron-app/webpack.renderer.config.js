"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rendererConfig = void 0;
const webpack_rules_1 = require("./webpack.rules");
const webpack_plugins_1 = require("./webpack.plugins");
webpack_rules_1.rules.push({
    test: /\.css$/,
    use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});
exports.rendererConfig = {
    module: {
        rules: webpack_rules_1.rules,
    },
    plugins: webpack_plugins_1.plugins,
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
    },
};
