[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
#nookies 0x1F36A 0x1F36A 0x1F36A
A collection of cookie helpers for Next.js

 - SSR support, for setter, parser and destory
 - super light
 - perfect for authentication

Setting and destorying cookies also works on server-side.

### Usage
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

## License
MIT