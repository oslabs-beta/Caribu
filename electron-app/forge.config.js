"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const maker_squirrel_1 = require("@electron-forge/maker-squirrel");
const maker_zip_1 = require("@electron-forge/maker-zip");
const maker_deb_1 = require("@electron-forge/maker-deb");
const maker_rpm_1 = require("@electron-forge/maker-rpm");
const plugin_webpack_1 = require("@electron-forge/plugin-webpack");
const webpack_main_config_1 = require("./webpack.main.config");
const webpack_renderer_config_1 = require("./webpack.renderer.config");
require('path');
const config = {
    packagerConfig: {
        appCopyright: 'Copyright © 2023 Jigglypuff Enterprises',
        // appBundleId: 'com.electronicarts.electronicarts',
        // appCategoryType: 'public.app-category.developer-tools',
        icon: __dirname + '/assets/circle_logo_thicker',
        name: 'Caribu',
    },
    rebuildConfig: {},
    makers: [new maker_squirrel_1.MakerSquirrel({}), new maker_zip_1.MakerZIP({}, ['darwin']), new maker_rpm_1.MakerRpm({}), new maker_deb_1.MakerDeb({})],
    plugins: [
        new plugin_webpack_1.WebpackPlugin({
            mainConfig: webpack_main_config_1.mainConfig,
            renderer: {
                config: webpack_renderer_config_1.rendererConfig,
                entryPoints: [
                    {
                        html: './src/index.html',
                        js: './src/renderer.ts',
                        name: 'main_window',
                        preload: {
                            js: './src/preload.ts',
                        },
                    },
                ],
            },
        }),
    ],
};
exports.default = config;
