import Elysia, { Static, t } from 'elysia'
import { authentication } from '../authentication'
import { db } from '@/db/connection'
import { products } from '@/db/schema'
import { and, eq, inArray } from 'drizzle-orm'

const productSchema = t.Object({
  id: t.Optional(t.String()),
  name: t.String(),
  description: t.Optional(t.String()),
  price: t.Number({ minimum: 0 }),
})

export const updateMenu = new Elysia().use(authentication).put(
  '/menu',
  async ({ getManagedstoreId, set, body }) => {
    const storeId = await getManagedstoreId()

    const {
      products: { deletedProductIds, newOrUpdatedProducts },
    } = body

    if (deletedProductIds.length > 0) {
      await db
        .delete(products)
        .where(
          and(
            inArray(products.id, deletedProductIds),
            eq(products.storeId, storeId),
          ),
        )
    }

    type Product = Static<typeof productSchema>
    type ProductWithId = Required<Product>
    type ProductWithoutId = Omit<Product, 'id'>

    const updatedProducts = newOrUpdatedProducts.filter(
      (product): product is ProductWithId => {
        return !!product.id
      },
    )

    if (updatedProducts.length > 0) {
      await Promise.all(
        updatedProducts.map((product) => {
          return db
            .update(products)
            .set({
              name: product.name,
              description: product.description,
              priceInCents: product.price * 100,
            })
            .where(
              and(eq(products.id, product.id), eq(products.storeId, storeId)),
            )
        }),
      )
    }

    const newProducts = newOrUpdatedProducts.filter(
      (product): product is ProductWithoutId => {
        return !product.id
      },
    )

    if (newProducts.length) {
      await db.insert(products).values(
        newProducts.map((product) => {
          return {
            name: product.name,
            description: product.description,
            priceInCents: product.price * 100,
            storeId,
          }
        }),
      )
    }

    set.status = 204
  },
  {
    body: t.Object({
      products: t.Object({
        newOrUpdatedProducts: t.Array(productSchema),
        deletedProductIds: t.Array(t.String()),
      }),
    }),
  },
)
