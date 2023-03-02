"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const viewsSlice_1 = __importDefault(require("./slices/viewsSlice"));
// create a redux store
exports.store = (0, toolkit_1.configureStore)({
    reducer: {
        views: viewsSlice_1.default,
    },
});
//# sourceMappingURL=store.js.map