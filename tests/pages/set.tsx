import { NextPage } from 'next'
import React from 'react'

import { setCookie } from '../../src/index'

const Set: NextPage = () => <div>{JSON.stringify(document.cookie)}</div>

Set.getInitialProps = async ctx => {
  setCookie(ctx, 'test', 'pass')
  return {}
}

export default Set
