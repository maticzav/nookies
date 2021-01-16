import React from 'react'
import Link from 'next/link'
import nookies from 'nookies'

export default class Home extends React.Component {
  static getInitialProps(ctx) {
    let cookies = nookies.get(ctx)

    return {
      server: true,
      cookies,
    }
  }

  render() {
    const props = this.props

    const server = props && props.server
    const cookies = (props && props.cookies) || {}

    return (
      <>
        <h1>List</h1>

        <p>
          Navigate between pages to create, remove and list cookies. You can
          also check them in the console.
        </p>
        {/* Links */}
        <nav>
          <ul>
            <li>
              <Link href="/create">
                <a>Create Cookies</a>
              </Link>
            </li>

            <li>
              <Link href="/remove">
                <a>Remove cookies</a>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Cookies */}
        <div>
          <h3>Cookies</h3>
          <ul>
            {Object.keys(cookies).map((name) => (
              <li key={name}>
                {name} : {cookies[name]}
              </li>
            ))}
          </ul>
        </div>
      </>
    )
  }
}
