import { createId } from '@paralleldrive/cuid2'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { users } from './users'
import { orders, products } from '.'

export const stores = pgTable('stores', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  managerId: text('manager_id').references(() => users.id, {
    onDelete: 'set null',
  }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const storesRelations = relations(stores, ({ one, many }) => ({
  manager: one(users, {
    fields: [stores.managerId],
    references: [users.id],
    relationName: 'storeManager',
  }),
  orders: many(orders),
  products: many(products),
}))
