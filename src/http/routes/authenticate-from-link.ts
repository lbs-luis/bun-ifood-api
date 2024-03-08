import Elysia, { t } from 'elysia'
import dayjs from 'dayjs'
import { authentication } from '../authentication'
import { db } from '@/db/connection'
import { authLinks } from '@/db/schema'
import { and, eq } from 'drizzle-orm'
import { UnauthorizedError } from './errors/unauthorized-error'
import { ExpiredLinkError } from './errors/expired-link'

export const authenticateFromLink = new Elysia().use(authentication).get(
  '/auth-links/authenticate',
  async ({ signUser, query, set }) => {
    const { code, redirect } = query

    const authLinkFromCode = await db
      .select({
        code: authLinks.code,
        createdAt: authLinks.createdAt,
        userId: authLinks.userId,
      })
      .from(authLinks)
      .where(and(eq(authLinks.code, code)))

    if (!authLinkFromCode) {
      throw new UnauthorizedError()
    }

    const authLink = authLinkFromCode.find((authLink) => authLink.code === code)

    if (!authLink) {
      throw new UnauthorizedError()
    }

    if (dayjs().diff(authLink.createdAt, 'days') > 7) {
      throw new ExpiredLinkError()
    }

    const managedstore = await db.query.stores.findFirst({
      where(fields, { eq }) {
        return eq(fields.managerId, authLink.userId)
      },
    })

    await signUser({
      sub: authLink.userId,
      storeId: managedstore?.id,
    })

    await db.delete(authLinks).where(eq(authLinks.code, code))

    set.redirect = redirect
  },
  {
    query: t.Object({
      code: t.String(),
      redirect: t.String(),
    }),
  },
)
