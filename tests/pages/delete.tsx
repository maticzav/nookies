import { NextPage } from 'next'
import React from 'react'

import { destroyCookie } from '../../src/index'

const Delete: NextPage<{}> = ({}) => (
  <div>{JSON.stringify(document.cookie)}</div>
)

Delete.getInitialProps = async ctx => {
  destroyCookie(ctx, 'remove')
  return {}
}

export default Delete
