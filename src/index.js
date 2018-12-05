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
    let cookies = ctx.res.getHeader('Set-Cookie') || []

    if (typeof cookies === 'string') {
      cookies = [cookies]
    }

    cookies.push(cookie.serialize(name, value, options))

    ctx.res.setHeader('Set-Cookie', cookies)
  }

  if (process.browser) {
    document.cookie = cookie.serialize(name, value, options)
  }

  return {}
}

export function destroyCookie(ctx = {}, name, options = {}) {
  if (ctx && ctx.res) {
    let cookies = ctx.res.getHeader('set-cookie') || []

    if (typeof cookies === 'string') {
      cookies = [cookies]
    }

    cookies.push(
      cookie.serialize(name, '', Object.assign({}, options, {maxAge: -1})),
    )

    ctx.res.setHeader('Set-Cookie', cookies)
  }

  if (process.browser) {
    document.cookie = cookie.serialize(name, '', Object.assign({}, options, {maxAge: -1}))
  }

  return {}
}
export default {
  set: (ctx, name, value, options = {}) => {
    setCookie(ctx, name, value, options)
  },
  get: (ctx, options) => parseCookies(ctx, options),
  destroy: (ctx, name, options = {}) => destroyCookie(ctx, name, options),
}
