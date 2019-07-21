import { NextPage } from 'next'
import React from 'react'

import { parseCookies } from '../../src/index'

type Props = {
  cookies: { [key: string]: string }
}

const Parse: NextPage<Props> = ({ cookies }) => (
  <div>{JSON.stringify(cookies)}</div>
)

Parse.getInitialProps = async ctx => {
  const cookies = parseCookies(ctx)
  return { cookies }
}

export default Parse
