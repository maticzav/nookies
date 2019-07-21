import * as cookie from 'cookie'
import { createServer, Server } from 'http'
import next from 'next'
import request from 'request-promise-native'
import { parse } from 'url'

const app = next({ dev: true, dir: __dirname })

describe('nookies', () => {
  let url: string = 'http://localhost:8312'
  let server: Server

  beforeAll(async () => {
    await app.prepare()
    await new Promise(resolve => {
      server = createServer((req, res) => {
        const { pathname, query } = parse(req.url!, true)

        switch (pathname) {
          case '/parse': {
            res.setHeader('Set-Cookie', [
              cookie.serialize('test-1', 'pass'),
              cookie.serialize('test-2', 'pass', {
                httpOnly: true,
                sameSite: true,
              }),
            ])
            app.render(req, res, '/parse', query)
          }
          case '/set': {
            app.render(req, res, '/set', query)
          }
          case '/delete': {
            res.setHeader('Set-Cookie', [
              cookie.serialize('remove', 'fail'),
              cookie.serialize('test', 'pass', {
                httpOnly: true,
                sameSite: true,
              }),
            ])
            app.render(req, res, '/delete', query)
          }
        }
      }).listen(8312, () => {
        console.log('Server up!')
        resolve()
      })
    })
  })

  afterAll(async () => {
    await new Promise(resolve => {
      server.close(resolve)
    })
  })

  test('parses cookies correclty', async () => {
    const snapshot = await request(`${url}/parse`)
    expect(snapshot).toMatchSnapshot()
  })

  test.todo('sets cookies correctly')
  test.todo('deletes cookies correctly')
})
