import Elysia, { t } from 'elysia'
import { authentication } from '../authentication'
import { db } from '@/db/connection'
import { stores } from '@/db/schema'
import { eq } from 'drizzle-orm'

export const updateProfile = new Elysia().use(authentication).put(
  '/profile',
  async ({ getManagedstoreId, set, body }) => {
    const storeId = await getManagedstoreId()
    const { name, description } = body

    await db
      .update(stores)
      .set({
        name,
        description,
      })
      .where(eq(stores.id, storeId))

    set.status = 204
  },
  {
    body: t.Object({
      name: t.String(),
      description: t.Optional(t.String()),
    }),
  },
)
