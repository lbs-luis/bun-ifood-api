import { Html } from '@react-email/components'
import Elysia from 'elysia'


export const getFriendlyFace = new Elysia().get('/', ({ set }) => {
  set.status = 200
  return 'API - DASHBOARD WIZARD'
})