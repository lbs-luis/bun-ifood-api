import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { pgTable, integer, text, timestamp } from 'drizzle-orm/pg-core'
import { stores, users } from '.'

export const evaluations = pgTable('evaluations', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  customerId: text('customer_id').references(() => users.id),
  storeId: text('store_id').references(() => users.id),
  rate: integer('rate').notNull(),
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const evaluationsRelations = relations(evaluations, ({ one }) => ({
  customer: one(users, {
    fields: [evaluations.customerId],
    references: [users.id],
  }),
  store: one(stores, {
    fields: [evaluations.storeId],
    references: [stores.id],
  }),
}))
