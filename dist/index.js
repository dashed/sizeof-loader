"use strict";

// Based on: https://github.com/boopathi/image-size-loader/issues/10#issue-237059548

var loaderUtils = require("loader-utils");
var sizeOf = require("image-size");
var fs = require("fs");
var urlLoader = require("url-loader");
var fileLoader = require("file-loader");

module.exports = function (content) {
    this.cacheable && this.cacheable();

    var resourcePath = this.resourcePath;

    var options = loaderUtils.getOptions(this) || {
        useFileLoader: false
    };

    var useFileLoader = options.useFileLoader;

    var wrappedLoader = useFileLoader ? fileLoader : urlLoader;

    var prefixCode = wrappedLoader.call(this, content);

    var image = sizeOf(resourcePath);

    image.bytes = fs.statSync(resourcePath).size;

    return "\n        " + prefixCode + ";\n\n        var src = module.exports;\n\n        module.exports = {\n\n            src: '' + src,\n            width: " + JSON.stringify(image.width) + ",\n            height: " + JSON.stringify(image.height) + ",\n            bytes: " + JSON.stringify(image.bytes) + ",\n            type: " + JSON.stringify(image.type) + ",\n\n            toString: function() {\n                return '' + src;\n            }\n        };\n    ";
};

module.exports.raw = true;