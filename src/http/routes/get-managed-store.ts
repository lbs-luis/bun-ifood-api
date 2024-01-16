import Elysia from 'elysia'
import { authentication } from '../authentication'
import { db } from '@/db/connection'

export const getManagedstore = new Elysia()
  .use(authentication)
  .get('/managed-store', async ({ getManagedstoreId }) => {
    const storeId = await getManagedstoreId()

    const store = await db.query.stores.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, storeId)
      },
    })

    if (!store) {
      throw new Error('store not found.')
    }

    return store
  })
