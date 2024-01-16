/* eslint-disable drizzle/enforce-delete-with-where */

import {
  authLinks,
  evaluations,
  orders,
  products,
  stores,
  users,
} from './schema'
import { faker } from '@faker-js/faker'
import { db } from './connection'
import chalk from 'chalk'
import { orderItems } from './schema/order-items'
import { createId } from '@paralleldrive/cuid2'

/**
 * Reset database
 */
await db.delete(orderItems)
await db.delete(orders)
await db.delete(evaluations)
await db.delete(products)
await db.delete(stores)
await db.delete(authLinks)
await db.delete(users)

console.log(chalk.yellow('✔ Database reset'))

/**
 * Create customers
 */
const [customer1, customer2] = await db
  .insert(users)
  .values([
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: 'customer',
    },
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: 'customer',
    },
  ])
  .returning()

console.log(chalk.yellow('✔ Created customers'))

/**
 * Create store manager
 */
const [manager] = await db
  .insert(users)
  .values({
    name: faker.person.fullName(),
    email: 'luis.felipe.lbs@gmail.com',
    role: 'manager',
  })
  .returning()

console.log(chalk.yellow('✔ Created manager'))

/**
 * Create store
 */
const [store] = await db
  .insert(stores)
  .values({
    name: faker.company.name(),
    description: faker.lorem.paragraph(),
    managerId: manager.id,
  })
  .returning()

console.log(chalk.yellow('✔ Created store'))

/**
 * Create products
 */
const availableProducts = await db
  .insert(products)
  .values([
    {
      name: faker.commerce.productName(),
      priceInCents: Number(
        faker.commerce.price({
          min: 190,
          max: 490,
          dec: 0,
        }),
      ),
      storeId: store.id,
      description: faker.commerce.productDescription(),
    },
    {
      name: faker.commerce.productName(),
      priceInCents: Number(
        faker.commerce.price({
          min: 190,
          max: 490,
          dec: 0,
        }),
      ),
      storeId: store.id,
      description: faker.commerce.productDescription(),
    },
    {
      name: faker.commerce.productName(),
      priceInCents: Number(
        faker.commerce.price({
          min: 190,
          max: 490,
          dec: 0,
        }),
      ),
      storeId: store.id,
      description: faker.commerce.productDescription(),
    },
    {
      name: faker.commerce.productName(),
      priceInCents: Number(
        faker.commerce.price({
          min: 190,
          max: 490,
          dec: 0,
        }),
      ),
      storeId: store.id,
      description: faker.commerce.productDescription(),
    },
    {
      name: faker.commerce.productName(),
      priceInCents: Number(
        faker.commerce.price({
          min: 190,
          max: 490,
          dec: 0,
        }),
      ),
      storeId: store.id,
      description: faker.commerce.productDescription(),
    },
    {
      name: faker.commerce.productName(),
      priceInCents: Number(
        faker.commerce.price({
          min: 190,
          max: 490,
          dec: 0,
        }),
      ),
      storeId: store.id,
      description: faker.commerce.productDescription(),
    },
    {
      name: faker.commerce.productName(),
      priceInCents: Number(
        faker.commerce.price({
          min: 190,
          max: 490,
          dec: 0,
        }),
      ),
      storeId: store.id,
      description: faker.commerce.productDescription(),
    },
    {
      name: faker.commerce.productName(),
      priceInCents: Number(
        faker.commerce.price({
          min: 190,
          max: 490,
          dec: 0,
        }),
      ),
      storeId: store.id,
      description: faker.commerce.productDescription(),
    },
    {
      name: faker.commerce.productName(),
      priceInCents: Number(
        faker.commerce.price({
          min: 190,
          max: 490,
          dec: 0,
        }),
      ),
      storeId: store.id,
      description: faker.commerce.productDescription(),
    },
  ])
  .returning()

console.log(chalk.yellow('✔ Created products'))

const ordersToInsert: (typeof orders.$inferInsert)[] = []
const orderItemsToPush: (typeof orderItems.$inferInsert)[] = []

for (let i = 0; i < 200; i++) {
  const orderId = createId()

  const orderProducts = faker.helpers.arrayElements(availableProducts, {
    min: 1,
    max: 3,
  })

  let totalInCents = 0

  orderProducts.forEach((orderProduct) => {
    const quantity = faker.number.int({
      min: 1,
      max: 3,
    })

    totalInCents += orderProduct.priceInCents * quantity

    orderItemsToPush.push({
      orderId,
      productId: orderProduct.id,
      priceInCents: orderProduct.priceInCents,
      quantity,
    })
  })

  ordersToInsert.push({
    id: orderId,
    customerId: faker.helpers.arrayElement([customer1.id, customer2.id]),
    storeId: store.id,
    status: faker.helpers.arrayElement([
      'pending',
      'canceled',
      'processing',
      'delivering',
      'delivered',
    ]),
    totalInCents,
    createdAt: faker.date.recent({
      days: 40,
    }),
  })
}

await db.insert(orders).values(ordersToInsert)
await db.insert(orderItems).values(orderItemsToPush)

console.log(chalk.yellow('✔ Created orders'))

console.log(chalk.greenBright('Database seeded successfully!'))

process.exit()
