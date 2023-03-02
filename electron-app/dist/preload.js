"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import the necessary Electron components.
const electron_1 = require("electron");
// White-listed channels.
const ipc = {
    'render': {
        // From render to main.
        'send': [
            'runScript' // Channel name
        ],
        // From main to render.
        'receive': [],
        // From render to main and back again.
        'sendReceive': []
    }
};
// Exposed protected methods in the render process.
electron_1.contextBridge.exposeInMainWorld(
// Allowed 'ipcRenderer' methods.
'ipcRender', {
    // From render to main.
    send: (channel, args) => {
        const validChannels = ipc.render.send;
        if (validChannels.includes(channel)) {
            electron_1.ipcRenderer.send(channel, args);
        }
    },
    // From main to render.
    receive: (channel, listener) => {
        const validChannels = ipc.render.receive;
        if (validChannels.includes(channel)) {
            // Deliberately strip event as it includes `sender`.
            electron_1.ipcRenderer.on(channel, (event, ...args) => listener(...args));
        }
    },
    // From render to main and back again.
    invoke: (channel, args) => {
        const validChannels = ipc.render.sendReceive;
        if (validChannels.includes(channel)) {
            return electron_1.ipcRenderer.invoke(channel, args);
        }
    }
});
//# sourceMappingURL=preload.js.map