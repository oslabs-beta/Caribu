"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("../../src/index.css");
const react_redux_1 = require("react-redux");
const viewsSlice_1 = require("../slices/viewsSlice");
const react_drag_drop_files_1 = require("react-drag-drop-files");
function DragDrop() {
    const dispatch = (0, react_redux_1.useDispatch)();
    const handleChange = (folder) => __awaiter(this, void 0, void 0, function* () {
        console.log(folder);
        yield dispatch((0, viewsSlice_1.update_filepath)({ path: folder.path }));
        // const reader = new FileReader();
        // reader.readAsText(folder.path);
    });
    return ((0, jsx_runtime_1.jsx)(react_drag_drop_files_1.FileUploader, { handleChange: handleChange, name: "folder", label: "Drag and drop your app folder here!" }));
}
exports.default = DragDrop;
//# sourceMappingURL=DragDrop.js.map