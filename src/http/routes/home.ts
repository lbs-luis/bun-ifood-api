import Elysia from 'elysia'

export const home = new Elysia().get('/', ({ set }) => {
  set.status = 200
  return 'API - DASHBOARD WIZARD'
})
