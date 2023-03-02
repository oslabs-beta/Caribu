import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { MakerDMG } from '@electron-forge/maker-dmg';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';

import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';
require('path');


const config: ForgeConfig = {
  packagerConfig: {
    appCopyright: 'Copyright © 2023 Jigglypuff Enterprises',
    // appBundleId: 'com.electronicarts.electronicarts',
    // appCategoryType: 'public.app-category.developer-tools',
    icon: './assets/circle_logo_thicker.icns',
    name: 'Caribu',
  },
  rebuildConfig: {},
  makers: [
    // new MakerSquirrel({}), 
    new MakerZIP({}, ['darwin']), 
    new MakerDMG({
      name: 'Caribu',
      icon: './assets/circle_logo_thicker.icns',
      format: 'ULFO',
    }),
    // new MakerRpm({}), 
    // new MakerDeb({}),
  ],
  plugins: [
    new WebpackPlugin({
      devContentSecurityPolicy: `default-src * self blob: data: gap:; style-src * self 'unsafe-inline' blob: data: gap:; script-src * 'self' 'unsafe-eval' 'unsafe-inline' blob: data: gap:; object-src * 'self' blob: data: gap:; img-src * self 'unsafe-inline' blob: data: gap:; connect-src self * 'unsafe-inline' blob: data: gap:; frame-src * self blob: data: gap:;`,
      mainConfig,
      renderer: {
        config: rendererConfig,
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

export default config;
