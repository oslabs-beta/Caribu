const babel = require('@babel/core')
const types = babel.types

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _helperPluginUtils = require("@babel/helper-plugin-utils");
var _default = (0, _helperPluginUtils.declare)((api, options) => {
  var _api$assumption;
  api.assertVersion(7);
  const noNewArrows = (_api$assumption = api.assumption("noNewArrows")) != null ? _api$assumption : !options.spec;
  const fileName = options.fileName || "noFileNameFound";
  return {
    name: "transform-arrow-functions",
    visitor: {
      ArrowFunctionExpression(path, state) {
        if (!path.isArrowFunctionExpression()) return;
        // let filePath = 
        let name = `CARIBU_CBUSTART${path.node.start}_CBUEND${path.node.end}_CBUPATH${fileName}`
        path.arrowFunctionToExpression({
          allowInsertArrow: false,
          noNewArrows,
          specCompliant: !noNewArrows
        });
        path.node.id = types.identifier(name);
      }
    }
  };
});
exports.default = _default;
