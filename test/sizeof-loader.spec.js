const fs = require("fs");
import { expect } from "chai";

const sizeofLoader = require("../src/index.js");

// ref: https://stackoverflow.com/a/24526156/412627
function base64_encode(file) {
    // read binary data
    const bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString("base64");
}

// image credit: https://www.pexels.com/photo/close-up-of-human-hand-327533/
const resourcePath = "test/pexels-photo-327533.jpeg";
const content = fs.readFileSync(resourcePath);
const encoded_content = base64_encode(resourcePath);

describe("sizeof-loader", function() {
    it("should use file-loader when useFileLoader is true", () => {
        const context = {
            cacheable: false,
            resourcePath: resourcePath,

            query: {
                useFileLoader: true
            },

            emitFile: () => {},

            options: {}
        };

        const result = sizeofLoader.call(context, content);

        const output = eval(`var __webpack_public_path__ = '';${result}`);

        const expected_src = `5fde3d7d7643c6698ef5d04b7eda2c13.jpeg`;

        expect(output.src).to.equal(expected_src);
        expect(output.width).to.equal(80);
        expect(output.height).to.equal(50);
        expect(output.bytes).to.equal(2262);
        expect(output.type).to.equal("jpg");
        expect(output.toString()).to.equal(expected_src);
    });

    it("should use file-loader when unable to be encoded", () => {
        const context = {
            cacheable: false,
            resourcePath: resourcePath,

            query: {
                limit: 2
            },

            emitFile: () => {},

            options: {}
        };

        const result = sizeofLoader.call(context, content);

        const output = eval(`var __webpack_public_path__ = '';${result}`);

        const expected_src = `5fde3d7d7643c6698ef5d04b7eda2c13.jpeg`;

        expect(output.src).to.equal(expected_src);
        expect(output.width).to.equal(80);
        expect(output.height).to.equal(50);
        expect(output.bytes).to.equal(2262);
        expect(output.type).to.equal("jpg");
        expect(output.toString()).to.equal(expected_src);
    });

    it("should use url-loader by default", () => {
        const context = {
            cacheable: false,
            resourcePath: resourcePath
        };

        const result = sizeofLoader.call(context, content);

        const output = eval(result);

        const expected_src = `data:image/jpeg;base64,${encoded_content}`;

        expect(output.src).to.equal(expected_src);
        expect(output.width).to.equal(80);
        expect(output.height).to.equal(50);
        expect(output.bytes).to.equal(2262);
        expect(output.type).to.equal("jpg");
        expect(output.toString()).to.equal(expected_src);
    });

    it("should use url-loader when useFileLoader is false", () => {
        const context = {
            cacheable: false,
            resourcePath: resourcePath,
            useFileLoader: false
        };

        const result = sizeofLoader.call(context, content);

        const output = eval(result);

        const expected_src = `data:image/jpeg;base64,${encoded_content}`;

        expect(output.src).to.equal(expected_src);
        expect(output.width).to.equal(80);
        expect(output.height).to.equal(50);
        expect(output.bytes).to.equal(2262);
        expect(output.type).to.equal("jpg");
        expect(output.toString()).to.equal(expected_src);
    });
});
