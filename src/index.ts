import {
  parse,
  CookieParseOptions,
  serialize,
  CookieSerializeOptions,
} from 'cookie'
import * as next from 'next'

const isBrowser = () => typeof window !== 'undefined'
const isNonEmptyString = (str: string) => str.trim() !== ''

/**
 *
 * Parses cookies.
 *
 * @param ctx
 * @param options
 */
export function parseCookies(
  ctx?: next.NextPageContext | null | undefined,
  options?: CookieParseOptions,
): { [key: string]: string } {
  /**
   * Parses cookies from the request on the server side (Next.js)
   */
  if (ctx && ctx.req && ctx.req.headers && ctx.req.headers.cookie) {
    return parse(ctx.req.headers.cookie as string, options)
  }

  /**
   * Parses cookies from the document in the browser.
   */
  if (isBrowser()) {
    return parse(document.cookie, options)
  }

  return {}
}

interface Cookie {
  name: string
  value: string
  options: CookieSerializeOptions
}

/**
 * Calculates the new headers which include the new cookie. While doing
 * so it also checks for any duplicates.
 *
 * @param cookie
 * @param headers
 */
function getSetCookieHeadersWithCookie(
  cookie: Cookie,
  headers: string | string[] | number | undefined,
): string[] {
  /**
   * Manipulates Set-Cookie header to remove duplicates.
   */

  if (typeof headers === 'string') headers = [headers]
  if (typeof headers === 'number') headers = []
  if (typeof headers === 'undefined') headers = []

  const existingCookies = parseSetCookieHeaders(headers)
  const missingCookies: Cookie[] = existingCookies.reduce<Cookie[]>(
    (acc, existingCookie) => {
      if (areCookiesEqual(cookie, existingCookie)) {
        return acc
      } else {
        return acc.concat(existingCookie)
      }
    },
    [cookie],
  )

  /**
   * Parse the new cookies into header.
   */
  const newSetCookieHeaders: string[] = missingCookies.map(cookie =>
    serialize(cookie.name, cookie.value, cookie.options),
  )

  return newSetCookieHeaders

  /* Helper functions. */

  /**
   * Parses a Set-Cookie header to prevent cookie duplication.
   * (Inspired by `set-cookie-parser` parseString function).
   *
   * @param header
   */
  function parseSetCookieHeaders(headers: string[]): Cookie[] {
    const cookies: Cookie[] = headers.map(header => {
      /* Parses name and value parts. */
      const [nameAndValue, ...parts] = header
        .split(';')
        .filter(isNonEmptyString)
      const [name, ...rawValue] = nameAndValue.split('=')
      const value = decodeURIComponent(rawValue.join('='))

      /* Parses serialization options. */
      const options = parts.reduce<CookieSerializeOptions>((acc, part) => {
        const [rawKey, ...rawValue] = part.split('=')
        const key = rawKey.trimLeft().toLowerCase()
        const value = rawValue.join('=')

        switch (key) {
          case 'domain':
            return { ...acc, domain: value }
          case 'expires':
            return { ...acc, expres: new Date(value) }
          case 'httponly':
            return { ...acc, httpOnly: true }
          case 'max-age':
            return { ...acc, maxAge: parseInt(value, 10) }
          case 'path':
            return { ...acc, path: value }
          case 'samesite': {
            const sameSite = value.toLowerCase()
            switch (sameSite) {
              case 'strict':
                return { ...acc, sameSite: 'strict' }
              case 'lax':
                return { ...acc, sameSite: 'lax' }
              case 'none':
                return { ...acc, sameSite: 'none' }
              default: {
                throw new Error('Something extremly strange happened.')
              }
            }
          }
          case 'secure':
            return { ...acc, secure: true }
          default:
            return { ...acc, [key]: value }
        }
      }, {})

      const cookie: Cookie = {
        name: name,
        value: value,
        options: options,
      }

      return cookie
    })

    return cookies
  }

  /**
   * Determines whether two cookies should be treated as equal.
   *
   * @param a
   * @param b
   */
  function areCookiesEqual(a: Cookie, b: Cookie): boolean {
    return (
      a.name === b.name &&
      a.options.domain === b.options.domain &&
      a.options.path === b.options.path &&
      a.options.httpOnly === b.options.httpOnly &&
      a.options.secure === b.options.secure &&
      a.options.sameSite === b.options.sameSite
    )
  }
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
  ctx: next.NextPageContext | null | undefined,
  name: string,
  value: string,
  options?: CookieSerializeOptions,
): void {
  const cookie: Cookie = {
    name,
    value,
    options: options || {},
  }

  /**
   * Calculates the new Set-Cookie headers and prevents duplication.
   */
  if (ctx && ctx.res && ctx.res.getHeader && ctx.res.setHeader) {
    const setCookieHeaders = ctx.res.getHeader('Set-Cookie')

    /* Adds the cookie to the list. */
    const newSetCookieHeaders = getSetCookieHeadersWithCookie(
      cookie,
      setCookieHeaders,
    )

    ctx.res.setHeader('Set-Cookie', newSetCookieHeaders)
  }

  /**
   * Simply adds a cookie in the browser.
   */
  if (isBrowser()) {
    document.cookie = serialize(cookie.name, cookie.value, cookie.options)
  }
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
  ctx: next.NextPageContext | null | undefined,
  name: string,
  options?: CookieSerializeOptions,
): void {
  /* A delete cookie. */
  const cookie: Cookie = {
    name,
    value: '',
    options: { ...(options || {}), maxAge: -1 },
  }

  /**
   * Deletes cookie on the server side and prevents duplication.
   */
  if (ctx && ctx.res && ctx.res.setHeader && ctx.res.getHeader) {
    const setCookieHeaders = ctx.res.getHeader('Set-Cookie') || []

    /* Adds delete cookie to the list. */
    const newSetCookieHeaders = getSetCookieHeadersWithCookie(
      cookie,
      setCookieHeaders,
    )

    ctx.res.setHeader('Set-Cookie', newSetCookieHeaders)
  }

  /**
   * Adds the cookie using browser's `document.cookie`.
   */
  if (isBrowser()) {
    document.cookie = serialize(cookie.name, cookie.value, cookie.options)
  }
}

export default {
  set: setCookie,
  get: parseCookies,
  destroy: destroyCookie,
}
