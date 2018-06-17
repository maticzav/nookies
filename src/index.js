/* global document */
import cookie from 'cookie'

export function parseCookies(ctx = {}, options = {}) {
  if (ctx.req && ctx.req.headers.cookie) {
    return cookie.parse(ctx.req.headers.cookie, options)
  }

  if (process.browser) {
    return cookie.parse(document.cookie, options)
  }

  return {}
}

export function setCookie(ctx = {}, name, value, options = {}) {
  if (ctx && ctx.res) {
    ctx.res.setHeader('Set-Cookie', cookie.serialize(name, value, options))
  }

  if (process.browser) {
    document.cookie = cookie.serialize(name, value, options)
  }

  return {}
}

export function destroyCookie(ctx = {}, name) {
  if (ctx && ctx.res) {
    ctx.res.setHeader(
      'Set-Cookie',
      cookie.serialize(name, '', {
        maxAge: -1,
      }),
    )
  }

  if (process.browser) {
    document.cookie = cookie.serialize(name, '', {
      maxAge: -1,
    })
  }

  return {}
}
export default {
  set: (ctx, name, value, options = {}) => {
    setCookie(ctx, name, value, options)
  },
  get: (ctx, options) => parseCookies(ctx, options),
  destroy: (ctx, name) => destroyCookie(ctx, name),
}
