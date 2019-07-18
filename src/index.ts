import * as cookie from 'cookie'
import * as next from 'next'
import * as setCookieParser from 'set-cookie-parser'
import { Cookie } from 'set-cookie-parser'
import { CookieSerializeOptions } from 'cookie'

const isBrowser = () => typeof window !== 'undefined'

/**
 * Compare the cookie and return true if the cookies has equivalent
 * options and the cookies would be overwritten in the browser storage.
 *
 * @param a first Cookie for comparision
 * @param b second Cookie for comparision
 */
function areCookiesEqual(a: Cookie, b: Cookie & CookieSerializeOptions) {
  return (
    a.name === b.name &&
    a.domain === b.domain &&
    a.path === b.path &&
    a.httpOnly === b.httpOnly &&
    a.secure === b.secure
  )
}

/**
 * Create an instance of the Cookie interface
 *
 * @param name name of the Cookie
 * @param value value of the Cookie
 * @param options Cookie options
 */
function createCookie(
  name: string,
  value: string,
  options: CookieSerializeOptions,
): Cookie {
  return {
    name: name,
    expires: options.expires,
    maxAge: options.maxAge,
    secure: options.secure,
    httpOnly: options.httpOnly,
    domain: options.domain,
    value: value,
    path: options.path,
  }
}

/**
 *
 * Parses cookies.
 *
 * @param ctx
 * @param options
 */
export function parseCookies(
  ctx?: next.NextContext | null | undefined,
  options?: cookie.CookieParseOptions,
) {
  if (ctx && ctx.req && ctx.req.headers && ctx.req.headers.cookie) {
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
  ctx: next.NextContext | null | undefined,
  name: string,
  value: string,
  options: cookie.CookieSerializeOptions,
) {
  if (ctx && ctx.res && ctx.res.getHeader && ctx.res.setHeader) {
    let cookies = ctx.res.getHeader('Set-Cookie') || []

    if (typeof cookies === 'string') cookies = [cookies]
    if (typeof cookies === 'number') cookies = []

    const parsedCookies = setCookieParser.parse(cookies)

    let cookiesToSet: string[] = []
    parsedCookies.forEach((parsedCookie: Cookie) => {
      if (!areCookiesEqual(parsedCookie, createCookie(name, value, options))) {
        cookiesToSet.push(
          cookie.serialize(parsedCookie.name, parsedCookie.value, {
            domain: parsedCookie.domain,
            path: parsedCookie.path,
            httpOnly: parsedCookie.httpOnly,
            secure: parsedCookie.secure,
            maxAge: parsedCookie.maxAge,
            expires: parsedCookie.expires,
          }),
        )
      }
    })

    cookiesToSet.push(cookie.serialize(name, value, options))
    ctx.res.setHeader('Set-Cookie', cookiesToSet)
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
  ctx: next.NextContext | null | undefined,
  name: string,
  options?: cookie.CookieSerializeOptions,
) {
  const opts = { ...(options || {}), maxAge: -1 }

  if (ctx && ctx.res && ctx.res.setHeader && ctx.res.getHeader) {
    let cookies = ctx.res.getHeader('Set-Cookie') || []

    if (typeof cookies === 'string') cookies = [cookies]
    if (typeof cookies === 'number') cookies = []

    cookies.push(cookie.serialize(name, '', opts))

    ctx.res.setHeader('Set-Cookie', cookies)
  }

  if (isBrowser()) {
    document.cookie = cookie.serialize(name, '', opts)
  }

  return {}
}

export default {
  set: setCookie,
  get: parseCookies,
  destroy: destroyCookie,
}
