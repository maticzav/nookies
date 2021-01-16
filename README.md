# nookies :cookie:

![Working](https://github.com/maticzav/nookies/workflows/Release/badge.svg)
[![npm version](https://badge.fury.io/js/nookies.svg)](https://badge.fury.io/js/nookies)

> A collection of cookie helpers for Next.js

## Features

- ✨ SSR support, for setter, parser and destroy
- ⚙️ Custom Express server support
- 🪶 super light
- 🛡 perfect for authentication

Setting and destroying cookies also works on server-side.

## Quick start

`yarn add nookies`

> You can play with the example code [here](https://codesandbox.io/s/charming-herschel-7z362).

### ServerSide cookies

```js
import nookies from 'nookies'

export default function Me() {
  return <div>My profile</div>
}

export async function getServerSideProps(ctx) {
  // Parse
  const cookies = nookies.get(ctx)

  // Set
  nookies.set(ctx, 'fromGetInitialProps', 'value', {
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
  })

  // Destroy
  // nookies.destroy(ctx, 'cookieName')

  return { cookies }
}
```

## Client-only Cookies

```js
import { parseCookies, setCookie, destroyCookie } from 'nookies'

function handleClick() {
  // Simply omit context parameter.
  // Parse
  const cookies = parseCookies()
  console.log({ cookies })

  // Set
  setCookie(null, 'fromClient', 'value', {
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
  })

  // Destroy
  // destroyCookie(null, 'cookieName')
}

export default function Me() {
  return <button onClick={handleClick}>Set Cookie</button>
}
```

## Custom Express server cookies

```js
const express = require('express');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const { parseCookies, setCookie, destroyCookie } = require('nookies');

app.prepare()
    .then(() => {
        const server = express();

        server.get('/page', (req, res) => {

          // Notice how the request object is passed
          const parsedCookies = parseCookies({ req });

          // Notice how the response object is passed
          setCookie({ res }, 'fromServer', 'value', {
            maxAge: 30 * 24 * 60 * 60,
            path: '/page',
          });

          // destroyCookie({ res }, 'fromServer');

          return handle(req, res);
        });

    );
```

## Reference

> For client side usage, omit the `ctx` parameter. You can do so by setting it to an empty object (`{}`), `null` or `undefined`.

### `parseCookies(ctx, options)` or `nookies.get(ctx, options)`

- **ctx:** `Next.js context` || `(Express request object)`
- **options:**
  - **decode:** `a custom resolver function (default: decodeURIComponent)`

### `setCookie(ctx, name, value, options)` or `nookies.set(ctx, name, value, options)`

> Don't forget to end your response on the server with `res.send()`.

- **ctx:** `(Next.js context)` || `(Express request object)`
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

### `destroyCookie(ctx, name, options)` or `nookies.destroy(ctx, 'token', options)`

> Don't forget to end your response on the server with `res.send()`. This might be the reason your cookie isn't removed.

- **ctx:** `(Next.js context)` || `(Express response object)`
- **name:** cookie name
- **options:**
  - **domain**
  - **path**

## License

MIT
