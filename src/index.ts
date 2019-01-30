import * as cookie from 'cookie'
import * as next from 'next'

const isBrowser = () => typeof window !== 'undefined'

/**
 *
 * Parses cookies.
 *
 * @param ctx
 * @param options
 */
export function parseCookies(
  ctx: next.NextContext,
  options?: cookie.CookieParseOptions,
) {
  if (ctx && ctx.req && ctx.req.headers.cookie) {
    return cookie.parse(ctx.req.headers.cookie as string, options)
  }

  if (isBrowser()) {
    return cookie.parse(document.cookie, options)
  }

  return {}
}

/**
 *
 * Sets a cookie.
 *
 * @param ctx
 * @param name
 * @param value
 * @param options
 */
export function setCookie(
  ctx: next.NextContext,
  name: string,
  value: string,
  options: cookie.CookieSerializeOptions,
) {
  if (ctx && ctx.res) {
    let cookies = ctx.res.getHeader('Set-Cookie') || []

    if (typeof cookies === 'string') cookies = [cookies]
    if (typeof cookies === 'number') cookies = []

    cookies.push(cookie.serialize(name, value, options))

    ctx.res.setHeader('Set-Cookie', cookies)
  }

  if (isBrowser()) {
    document.cookie = cookie.serialize(name, value, options)
  }

  return {}
}

/**
 *
 * Destroys a cookie with a particular name.
 *
 * @param ctx
 * @param name
 * @param options
 */
export function destroyCookie(
  ctx: next.NextContext,
  name: string,
  options: cookie.CookieSerializeOptions,
) {
  options = { ...options, maxAge: -1 }

  if (ctx && ctx.res) {
    let cookies = ctx.res.getHeader('set-cookie') || []

    if (typeof cookies === 'string') cookies = [cookies]
    if (typeof cookies === 'number') cookies = []

    cookies.push(cookie.serialize(name, '', options))

    ctx.res.setHeader('Set-Cookie', cookies)
  }

  if (isBrowser()) {
    document.cookie = cookie.serialize(name, '', options)
  }

  return {}
}

export default {
  set: setCookie,
  get: parseCookies,
  destroy: destroyCookie,
}
