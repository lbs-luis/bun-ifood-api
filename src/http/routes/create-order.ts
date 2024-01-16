import { db } from '@/db/connection'
import { orders } from '@/db/schema'
import Elysia, { t } from 'elysia'
import { authentication } from '../authentication'
import { orderItems } from '@/db/schema/order-items'

export const createOrder = new Elysia().use(authentication).post(
  '/stores/:storeId/orders',
  async ({ params, body, getCurrentUser, set }) => {
    const { sub: customerId } = await getCurrentUser()
    const { storeId } = params
    const { items } = body

    const productsIds = items.map((item) => item.productId)

    const products = await db.query.products.findMany({
      where(fields, { eq, and, inArray }) {
        return and(eq(fields.storeId, storeId), inArray(fields.id, productsIds))
      },
    })

    const orderProducts = items.map((item) => {
      const product = products.find((product) => product.id === item.productId)

      if (!product) {
        throw new Error('Not all products are available in this store.')
      }

      return {
        productId: item.productId,
        unitPriceInCents: product.priceInCents,
        quantity: item.quantity,
        subtotalInCents: item.quantity * product.priceInCents,
      }
    })

    const totalInCents = orderProducts.reduce((total, orderItem) => {
      return total + orderItem.subtotalInCents
    }, 0)

    await db.transaction(async (tx) => {
      const [order] = await tx
        .insert(orders)
        .values({
          totalInCents,
          customerId,
          storeId,
        })
        .returning({
          id: orders.id,
        })

      await tx.insert(orderItems).values(
        orderProducts.map((orderProduct) => {
          return {
            orderId: order.id,
            productId: orderProduct.productId,
            priceInCents: orderProduct.unitPriceInCents,
            quantity: orderProduct.quantity,
          }
        }),
      )
    })

    set.status = 201
  },
  {
    body: t.Object({
      items: t.Array(
        t.Object({
          productId: t.String(),
          quantity: t.Integer(),
        }),
      ),
    }),
    params: t.Object({
      storeId: t.String(),
    }),
  },
)
