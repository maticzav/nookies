[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

# nookies :cookie: :cookie: :cookie:
A collection of cookie helpers for Next.js

 - SSR support, for setter, parser and destory
 - super light
 - perfect for authentication

Setting and destorying cookies also works on server-side.

### Quick start
```js
// Parse
parseCookies(ctx)

// Set
setCookie(ctx, 'token', token, {
   maxAge: 30 * 24 * 60 * 60,
   path: '/'
})

// Destory
destroyCookie(ctx, 'token')
```

### Reference
#### `parseCookies(ctx, options)`
 - __ctx:__ `Next.js context`
 - __options:__
   - __decode:__ `a custom resolver function (default: decodeURIComponent)`

#### `setCookie(ctx, name, value, options)`
 - __ctx:__ `(Next.js context)`
 - __name:__ cookie name
 - __value:__ cookie value
 - __options:__ 
   - __domain__
   - __encode__
   - __expires__
   - __httpOnly__
   - __maxAge__
   - __path__
   - __sameSite__
   - __secure__

#### `destroyCookie(ctx, name)`
 - __ctx:__ (Next.js context)
 - __name:__ cookie name

## License
MIT

