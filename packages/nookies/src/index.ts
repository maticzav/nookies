import * as cookie from 'cookie'
import * as express from 'express'
import * as next from 'next'
import * as setCookieParser from 'set-cookie-parser'
import { Cookie } from 'set-cookie-parser'

import { areCookiesEqual, createCookie, isBrowser } from './utils'

/**
 * Parses cookies.
 *
 * @param ctx NextJS page or API context, express context, null or undefined.
 * @param options Options that we pass down to `cookie` library.
 */
export function parseCookies(
  ctx?:
    | Pick<next.NextPageContext, 'req'>
    | { req: next.NextApiRequest }
    | { req: express.Request }
    | null
    | undefined,
  options?: cookie.CookieParseOptions,
) {
  if (ctx?.req?.headers?.cookie) {
    return cookie.parse(ctx.req.headers.cookie as string, options)
  }

  if (isBrowser()) {
    return cookie.parse(document.cookie, options)
  }

  return {}
}

/**
 * Sets a cookie.
 *
 * @param ctx NextJS page or API context, express context, null or undefined.
 * @param name The name of your cookie.
 * @param value The value of your cookie.
 * @param options Options that we pass down to `cookie` library.
 */
export function setCookie(
  ctx:
    | Pick<next.NextPageContext, 'res'>
    | { res: next.NextApiResponse }
    | { res: express.Response }
    | null
    | undefined,
  name: string,
  value: string,
  options: cookie.CookieSerializeOptions,
) {
  // SSR
  if (ctx?.res?.getHeader && ctx.res.setHeader) {
    // Check if response has finished and warn about it.
    if (ctx?.res?.finished) {
      console.warn(`Not setting "${name}" cookie. Response has finished.`)
      console.warn(`You should set cookie before res.send()`)
      return {}
    }

    /**
     * Load existing cookies from the header and parse them.
     */
    let cookies = ctx.res.getHeader('Set-Cookie') || []

    if (typeof cookies === 'string') cookies = [cookies]
    if (typeof cookies === 'number') cookies = []

    /**
     * Parse cookies but ignore values - we've already encoded
     * them in the previous call.
     */
    const parsedCookies = setCookieParser.parse(cookies, {
      decodeValues: false,
    })

    /**
     * We create the new cookie and make sure that none of
     * the existing cookies match it.
     */
    const newCookie = createCookie(name, value, options)
    let cookiesToSet: string[] = []

    parsedCookies.forEach((parsedCookie: Cookie) => {
      if (!areCookiesEqual(parsedCookie, newCookie)) {
        /**
         * We serialize the cookie back to the original format
         * if it isn't the same as the new one.
         */
        const serializedCookie = cookie.serialize(
          parsedCookie.name,
          parsedCookie.value,
          {
            // we prevent reencoding by default, but you might override it
            encode: (val: string) => val,
            ...(parsedCookie as cookie.CookieSerializeOptions),
          },
        )

        cookiesToSet.push(serializedCookie)
      }
    })
    cookiesToSet.push(cookie.serialize(name, value, options))

    // Update the header.
    ctx.res.setHeader('Set-Cookie', cookiesToSet)
  }

  // Browser
  if (isBrowser()) {
    if (options && options.httpOnly) {
      throw new Error('Can not set a httpOnly cookie in the browser.')
    }

    document.cookie = cookie.serialize(name, value, options)
  }

  return {}
}

/**
 * Destroys a cookie with a particular name.
 *
 * @param ctx NextJS page or API context, express context, null or undefined.
 * @param name Cookie name.
 * @param options Options that we pass down to `cookie` library.
 */
export function destroyCookie(
  ctx:
    | Pick<next.NextPageContext, 'res'>
    | { res: next.NextApiResponse }
    | { res: express.Response }
    | null
    | undefined,
  name: string,
  options?: cookie.CookieSerializeOptions,
) {
  /**
   * We forward the request destroy to setCookie function
   * as it is the same function with modified maxAge value.
   */
  return setCookie(ctx, name, '', { ...(options || {}), maxAge: -1 })
}

/* Utility Exports */

export default {
  set: setCookie,
  get: parseCookies,
  destroy: destroyCookie,
}
