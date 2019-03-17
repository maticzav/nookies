# nookies :cookie: :cookie: :cookie:

[![CircleCI](https://circleci.com/gh/maticzav/nookies/tree/master.svg?style=shield)](https://circleci.com/gh/maticzav/nookies/tree/master) [![npm version](https://badge.fury.io/js/nookies.svg)](https://badge.fury.io/js/nookies)

A collection of cookie helpers for Next.js

- SSR support, for setter, parser and destroy
- super light
- perfect for authentication

Setting and destroying cookies also works on server-side.

## Quick start

`npm install --save nookies`

### SSR cookies

```js
import { parseCookies, setCookie, destroyCookie } from 'nookies'

export default class Me extends React.Component {
  static async getInitialProps(ctx) {
    // Parse
    parseCookies(ctx)

    // Set
    setCookie(ctx, 'token', token, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    })

    // Destory
    destroyCookie(ctx, 'token')
  }

  render() {
    return <div>My profile</div>
  }
}
```

OR

```js
import nookies from 'nookies'

export default class Me extends React.Component {
  static async getInitialProps(ctx) {
    // Parse
    nookies.get(ctx)

    // Set
    nookies.set(ctx, 'token', token, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    })

    // Destory
    nookies.destroy(ctx, 'token')
  }

  render() {
    return <div>My profile</div>
  }
}
```

### Cookies on the client

```js
import nookies from 'nookies'

export default class Me extends React.Component {
  handleClick = () => {
    // Simply omit context parameter.
    const cookies = parseCookies()
    console.log({ cookies })
  }

  render() {
    return <button onClick={this.handleClick}>Click Me!</button>
  }
}
```

### Reference

> For client side usage, omit the `ctx` parameter. You can do so by setting it to an empty object (`{}`).

#### `parseCookies(ctx, options)` or `cookies.get(ctx, options)`

- **ctx:** `Next.js context`
- **options:**
  - **decode:** `a custom resolver function (default: decodeURIComponent)`

#### `setCookie(ctx, name, value, options)` or `cookies.set(ctx, name, value, options)`

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

#### `destroyCookie(ctx, name)` or `cookies.destroy(ctx, 'token')`

- **ctx:** (Next.js context)
- **name:** cookie name

## License

MIT
