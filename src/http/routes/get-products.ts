/* eslint-disable prettier/prettier */
import Elysia, { t } from 'elysia'
import { authentication } from '../authentication'
import { and, count, desc, eq, ilike } from 'drizzle-orm'
import { db } from '@/db/connection'
import { products } from '@/db/schema'

export const getProducts = new Elysia()
  .use(authentication)
  .get('/products',
    async ({ query, getCurrentUser, set }) => {
      const { pageIndex, productId, productName } = query
      const { storeId } = await getCurrentUser()

      if (!storeId) {
        set.status = 401

        throw new Error('User is not a store manager.')
      }

      const baseQuery = db
        .select({
          productId: products.id,
          productName: products.name,
          productDescription: products.description,
          totalInCents: products.priceInCents,
          createdAt: products.createdAt
        })
        .from(products) 
        .where(and(eq(products.storeId, storeId),
          productId ? ilike(products.id, `%${productId}%`) : undefined,
          productName ? ilike(products.name, `%${productName}%`) : undefined,))

      const [productsCount] = await db
        .select({ count: count() })
        .from(baseQuery.as('baseQuery'))

      const allProducts = await baseQuery
        .offset(pageIndex * 10)
        .limit(10)
        .orderBy((fields) => {
          return [
            desc(fields.createdAt),
          ]
        })

      const result = {
        products: allProducts,
        meta: {
          pageIndex,
          perPage: 10,
          totalCount: productsCount.count,
        },
      }

      return result
    },
    {
      query: t.Object({
        productName: t.Optional(t.String()),
        productId: t.Optional(t.String()),
        pageIndex: t.Numeric({ minimum: 0 }),
      }),
    },
  )

