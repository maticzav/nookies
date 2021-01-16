import React from 'react'
import Link from 'next/link'
import nookies from 'nookies'

/* Website, SSR */

export default class Home extends React.Component {
  static getInitialProps(ctx) {
    const cookies = nookies.get(ctx)

    for (const cookie of Object.keys(cookies)) {
      nookies.destroy(ctx, cookie)
    }

    return {
      server: true,
    }
  }

  render() {
    return (
      <>
        <h1>Destroy</h1>

        <p>We've removed every cookie. Check it out in the list page.</p>

        {/* Navigation */}
        <nav>
          <ul>
            <li>
              <Link href="/">
                <a>List cookies</a>
              </Link>
            </li>

            <li>
              <Link href="/create">
                <a>Create cookies</a>
              </Link>
            </li>
          </ul>
        </nav>

        {/*  */}
      </>
    )
  }
}
