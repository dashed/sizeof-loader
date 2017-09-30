// Based on: https://github.com/boopathi/image-size-loader/issues/10#issue-237059548

const loaderUtils = require("loader-utils");
const sizeOf = require("image-size");
const fs = require("fs");
const urlLoader = require("url-loader");
const fileLoader = require("file-loader");

module.exports = function(content) {
    this.cacheable && this.cacheable();

    const resourcePath = this.resourcePath;

    const options = loaderUtils.getOptions(this) || {
        useFileLoader: false
    };

    const useFileLoader = options.useFileLoader;

    const wrappedLoader = useFileLoader ? fileLoader : urlLoader;

    let prefixCode = wrappedLoader.call(this, content);

    const image = sizeOf(resourcePath);

    const bytes = fs.statSync(resourcePath).size;

    if (prefixCode.startsWith("export default")) {
        prefixCode = `module.exports = ${prefixCode.substring(
            "export default".length
        )}`;
    }

    return `
        ${prefixCode};

        var src = '' + module.exports;

        module.exports = {

            src: src,
            width: ${JSON.stringify(image.width)},
            height: ${JSON.stringify(image.height)},
            type: ${JSON.stringify(image.type)},
            bytes: ${JSON.stringify(bytes)},

            toString: function() {
                return src;
            }
        };
    `;
};

module.exports.raw = true;
