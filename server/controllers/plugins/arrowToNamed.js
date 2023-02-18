const babel = require("@babel/core");
const types = babel.types;

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = void 0;
var _helperPluginUtils = require("@babel/helper-plugin-utils");
const { fileURLToPath } = require("url");
var _default = (0, _helperPluginUtils.declare)((api, options) => {
  var _api$assumption;
  api.assertVersion(7);
  const noNewArrows =
    (_api$assumption = api.assumption("noNewArrows")) != null
      ? _api$assumption
      : !options.spec;
  let fileName = options.fileName || "noFileNameFound";
  return {
    name: "transform-arrow-functions",
    visitor: {
      ArrowFunctionExpression(path, state) {
        if (!path.isArrowFunctionExpression()) return;
        // let filePath =
        fileName = fileName.replaceAll("-", "Ü");
        let name = `CBUNAME_ANONYMOUS_CBUTYPE_ARROWFUNCTION_CARIBU_CBUSTART${path.node.start}_CBUEND${path.node.end}_CBUPATH${fileName}`;
        path.arrowFunctionToExpression({
          allowInsertArrow: false,
          noNewArrows,
          specCompliant: !noNewArrows,
        });
        path.node.id = types.identifier(name);
      },
    },
  };
});
exports.default = _default;