# nookies :cookie: :cookie: :cookie:

[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo) [![CircleCI](https://circleci.com/gh/maticzav/nookies/tree/master.svg?style=shield)](https://circleci.com/gh/maticzav/nookies/tree/master) [![npm version](https://badge.fury.io/js/nookies.svg)](https://badge.fury.io/js/nookies)

A collection of cookie helpers for Next.js

- SSR support, for setter, parser and destory
- super light
- perfect for authentication

Setting and destorying cookies also works on server-side.

## Quick start

```js
import { parseCookies, setCookie, destroyCookie } from "nookies";

export default class Me extends React.Component {
  static async getInitialProps(ctx) {
    // Parse
    parseCookies(ctx);

    // Set
    setCookie(ctx, "token", token, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/"
    });

    // Destory
    destroyCookie(ctx, "token");
  }

  render() {
    return <div>My profile</div>;
  }
}
```

### Reference

#### `parseCookies(ctx, options)`

- **ctx:** `Next.js context`
- **options:**
  - **decode:** `a custom resolver function (default: decodeURIComponent)`

#### `setCookie(ctx, name, value, options)`

- **ctx:** `(Next.js context)`
- **name:** cookie name
- **value:** cookie value
- **options:**
  - **domain**
  - **encode**
  - **expires**
  - **httpOnly**
  - **maxAge**
  - **path**
  - **sameSite**
  - **secure**

#### `destroyCookie(ctx, name)`

- **ctx:** (Next.js context)
- **name:** cookie name

## License

MIT
