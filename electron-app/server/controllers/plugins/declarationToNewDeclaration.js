// const babel = require("@babel/core");
// const types = babel.types;





const babel = require("@babel/core");
const types = babel.types;

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = void 0;
var _helperPluginUtils = require("@babel/helper-plugin-utils");
const { fileURLToPath } = require("url");
var _default = (0, _helperPluginUtils.declare)((api, options) => {
  // var _api$assumption;
  api.assertVersion(7);
  // const noNewArrows =
  //   (_api$assumption = api.assumption("noNewArrows")) != null
  //     ? _api$assumption
  //     : !options.spec;
  let fileName = options.fileName.replaceAll("-", "Ü") || "noFileNameFound";
  // fileName = fileName.replaceAll("-", "Ü");
  return {
    name : 'declarationToNewDeclaration',
        visitor: {
          FunctionDeclaration(path) {
            if (path.node.id.name) {
              path.node.id.name = `CBUNAME_${path.node.id.name}_CBUTYPE_FUNCTIONDECLARATION_CARIBU_CBUSTART${path.node.start}_CBUEND${path.node.end}_CBUPATH${fileName}`
            }
          }
        }
  };
});

exports.default = _default;

// module.exports = () => {
//   let fileName = options.fileName || "noFileNameFound";
//   return {
//     name : 'declarationToNewDeclaration',
//     visitor: {
//       FunctionDeclaration(path) {
//         if (path.node.id.name) {
//           path.node.id.name = `CBUNAME_${path.node.id.name}_CBUTYPE_FUNCTIONDECLARATION_CARIBU_CBUSTART${path.node.start}_CBUEND${path.node.end}_CBUPATH${fileName}`
//         }
//       }
//     }
//   }
// }




// exports.default = customPlugin