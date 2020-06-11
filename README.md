sizeof-loader [![Build Status](https://github.com/dashed/advent-of-code/workflows/node.js/badge.svg)](https://github.com/dashed/advent-of-code/actions?workflow=node.js) [![npm version](https://img.shields.io/npm/v/sizeof-loader.svg?style=flat)](https://www.npmjs.com/package/sizeof-loader)
==============

> Webpack loader that works like [`url-loader`](https://github.com/webpack-contrib/url-loader) (or [`file-loader`](https://github.com/webpack-contrib/file-loader)) but with extracted information such as image dimensions and file-size.

## Install

```sh
yarn add --dev sizeof-loader
# or
npm install --save-dev sizeof-loader
```

## Usage

```js
// webpack.confg.js

// ...

module.exports = {
    module: {
        rules: [
            {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                use: [
                    {
                        loader: "sizeof-loader",

                        options: {
                            // default is false
                            useFileLoader: false,

                            // any options will be passed to file-loader or url-loader
                            limit: 10000,
                            name: "static/media/[name].[hash:8].[ext]"
                        }
                    }
                ]
            }
        ]

        // ...
    }

    // ...
};

```

```js
// path/to/amazing/app/src/components/logo.js

import logo_img from "images/logo.png";

// logo_img is:
{

    // Output emitted from either:
    // - https://github.com/webpack-contrib/file-loader
    // - https://github.com/webpack-contrib/url-loader
    src: 'path/to/logo.png',

    // Output emitted by: https://github.com/image-size/image-size
    width: 400,
    height: 200,
    bytes: 12345,
    type: 'png',

    // useful for console.log
    toString: function() { /* ... */ }
}
```

## Options (webpack)

By default, `useFileLoader` is `false`.

If `useFileLoader` is `false`, then `url-loader` is wrapped. Any given options will be passed onto this loader.

However, if you pass `useFileLoader: true`, then [`file-loader`](https://github.com/webpack-contrib/file-loader) will be used, and any given options will be passed onto that loader.

## Supported file-types

[`image-size`](https://github.com/image-size/image-size) is used internally.

See: https://github.com/image-size/image-size#supported-formats

## Use case

```js
// project_root/src/components/logo.js

import styled from "styled-components";

import logo_img from "images/logos/homepage.png";
import { bg_image } from "styles/mixins";

const Logo = styled.div`
    display: inline-block;

    ${bg_image(logo_img, /* resolution */ 2)};
`;

export default Logo;
```

```js
// project_root/src/styles/mixins.js

import { css } from "styled-components";

export const bg_image = (resolved_image, resolution) => {
    const width = `${resolved_image.width / resolution}px`;
    const height = `${resolved_image.height / resolution}px`;

    return css`

        background-image: url('${resolved_image.src}');
        background-repeat: no-repeat;
        background-position: center;
        background-size: ${width} ${height};

        height: ${height};
        width: ${width};

    `;
};
```

Credits
=======

Code is based on: https://github.com/boopathi/image-size-loader but wraps url-loader and file-loader.

Development
===========

- `node.js` and `npm`. See: https://github.com/creationix/nvm#installation
- `yarn`. See: https://yarnpkg.com/en/docs/install
- `npm` dependencies. Run: `yarn install`

## Chores

- Lint: `yarn run lint`
- Prettier: `yarn run pretty`
- Test: `yarn run test`
- Pre-publish: `yarn run prepublish`
- Build: `yarn run build`

License
=======

MIT.
