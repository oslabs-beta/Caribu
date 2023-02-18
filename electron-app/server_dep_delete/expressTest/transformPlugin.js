const babel = require("@babel/core");
// const { Visitor } = babel


module.exports = function(babel) {
  const t = babel.types;

    visitor = {
      FunctionExpression(path) {
        const id = path.node.id;

        if (!id) {
          const id = t.identifier(`anonymous_function_${path.node.start}`);
          path.replaceWith(t.arrowFunctionExpression(path.node.params, path.node.body, id))
        }
      }
    }
    return visitor
};

