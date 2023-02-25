var renameFuncs = function (req, res, next) {
    console.log("IN RENAME FUNCS");
    var fs = require("fs");
    var _a = require("./serverDirPaths"), copiedServer = _a.copiedServer, renamedServer = _a.renamedServer;
    var _b = require("./pluginPaths"), arrowToNamed = _b.arrowToNamed, declarationToNewDeclaration = _b.declarationToNewDeclaration, expressionToDeclaration = _b.expressionToDeclaration;
    var parser = require("@babel/parser");
    var generate = require("@babel/generator")["default"];
    var traverse = require("@babel/traverse")["default"];
    var babelTransform = function (code, filePath) {
        var replace = require("@babel/core").transformSync(code, {
            plugins: [
                [
                    declarationToNewDeclaration,
                    {
                        fileName: filePath
                    },
                ],
                [
                    expressionToDeclaration,
                    {
                        fileName: filePath
                    },
                ],
                [
                    arrowToNamed,
                    {
                        fileName: filePath
                    },
                ],
            ],
            comments: true,
            retainLines: true
        }).code;
        return replace;
    };
    var oldDirectoryPathOG = copiedServer;
    var newDirectoryPath = renamedServer;
    var processDirectory = function (oldDirectoryPath) {
        fs.readdir(oldDirectoryPath, function (error, files) {
            if (error) {
                console.error("Error reading directory: ".concat(error));
                return;
            }
            var newDirectorySubPath = oldDirectoryPath.replace(oldDirectoryPathOG, newDirectoryPath);
            console.log(newDirectorySubPath);
            files.forEach(function (fileName) {
                var oldFilePath = "".concat(oldDirectoryPath, "/").concat(fileName);
                var newFilePath = "".concat(newDirectorySubPath, "/").concat(fileName);
                fs.stat(oldFilePath, function (error, stat) {
                    if (error) {
                        console.error("Error getting file stats: ".concat(error));
                        return;
                    }
                    console.log("before dir Check");
                    if (stat.isDirectory()) {
                        if (oldFilePath.indexOf('/node_modules') !== -1) {
                            console.log("".concat(oldFilePath, " contains '/node_modules' when we have already copied the node modules. Continuing without copying. Location: ").concat(oldFilePath.indexOf('/node_modules')));
                        }
                        else {
                            console.log(oldFilePath + " is a directory");
                            console.log(newFilePath);
                            fs.mkdirSync(newFilePath, { recursive: true }, function (err) {
                                return console.log("error in mkDirSync", err);
                            });
                            console.log("made this path:", newFilePath);
                            processDirectory(oldFilePath);
                        }
                    }
                    else if (fileName.endsWith(".js")) {
                        console.log("js check hit");
                        fs.readFile(oldFilePath, "utf-8", function (error, code) {
                            if (error) {
                                console.error("Error reading file: ".concat(error));
                                return;
                            }
                            var cleanFilePath = oldFilePath
                                .replaceAll("/", "$")
                                .replaceAll(".", "_");
                            cleanFilePath = cleanFilePath.slice(1);
                            var modifiedCode = babelTransform(code, cleanFilePath);
                            console.log("writing '".concat(oldFilePath, "' to '").concat(newDirectorySubPath, "' "));
                            fs.writeFileSync(newFilePath, modifiedCode, function (error) {
                                if (error)
                                    console.error("Error writing file: ".concat(error));
                            });
                        });
                    }
                });
            });
        });
    };
    processDirectory(oldDirectoryPathOG);
    console.log("done processing");
    setTimeout(function () {
        next();
    }, 5000);
};
module.exports = renameFuncs;
