"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainConfig = void 0;
const webpack_rules_1 = require("./webpack.rules");
exports.mainConfig = {
    /**
     * This is the main entry point for your application, it's the first file
     * that runs in the main process.
     */
    entry: './src/index.ts',
    // Put your normal webpack config below here
    module: {
        rules: webpack_rules_1.rules,
    },
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
    },
};
