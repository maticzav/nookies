# nookies :cookie: :cookie: :cookie:

[![CircleCI](https://circleci.com/gh/maticzav/nookies/tree/master.svg?style=shield)](https://circleci.com/gh/maticzav/nookies/tree/master) [![npm version](https://badge.fury.io/js/nookies.svg)](https://badge.fury.io/js/nookies)

A collection of cookie helpers for Next.js

- SSR support, for setter, parser and destroy
- Custom Express server support
- super light
- perfect for authentication

Setting and destroying cookies also works on server-side.

<!-- BANNER START -->

[![Sponsored By LabelSync](https://label-sync.com/img/ads/github.png)](https://label-sync.com)

<!-- BANNER END -->

## Quick start

`npm install --save nookies`

## Demo

Try a demo of the example code below here:

### [Demo on CodeSandbox](https://codesandbox.io/s/charming-herschel-7z362)

## `getServerSideProps` cookies (SSR + Client)

```js
import { parseCookies, setCookie, destroyCookie } from 'nookies'

export default function Me({ cookies }) {
  return (
    <div>
      My profile. Cookies:
      <ul>
        {cookies &&
          Object.entries(cookies).map(([name, value]) => (
            <li>
              {name}: {value}
            </li>
          ))}
      </ul>
    </div>
  )
}

export async function getServerSideProps({ ctx }) {
  // Parse
  const cookies = parseCookies(ctx)

  // Set
  setCookie(ctx, 'fromGetServerSideProps', 'value', {
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
  })

  // Destroy
  // destroyCookie(ctx, 'cookieName')

  return { cookies }
}
```

OR

```js
import nookies from 'nookies'

export default function Me() {
  return <div>My profile</div>
}

export async function getServerSideProps({ ctx }) {
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

> For client side usage, omit the `ctx` parameter. You can do so by setting it to an empty object (`{}`).

### `parseCookies(ctx, options)` or `cookies.get(ctx, options)`

- **ctx:** `Next.js context` || `(Express request object)`
- **options:**
  - **decode:** `a custom resolver function (default: decodeURIComponent)`

### `setCookie(ctx, name, value, options)` or `cookies.set(ctx, name, value, options)`

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

### `destroyCookie(ctx, name, options)` or `cookies.destroy(ctx, 'token', options)`

- **ctx:** `(Next.js context)` || `(Express response object)`
- **name:** cookie name
- **options:**
  - **domain**
  - **path**

## License

MIT
