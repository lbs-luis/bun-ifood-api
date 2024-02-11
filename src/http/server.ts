import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'

import { registerStore } from './routes/register-store'
import { registerCustomer } from './routes/register-customer'
import { sendAuthenticationLink } from './routes/send-authentication-link'
import { createOrder } from './routes/create-order'
import { approveOrder } from './routes/approve-order'
import { cancelOrder } from './routes/cancel-order'
import { getOrders } from './routes/get-orders'
import { createEvaluation } from './routes/create-evaluation'
import { getEvaluations } from './routes/get-evaluations'
import { updateProducts } from './routes/update-products'
import { updateProfile } from './routes/update-profile'
import { authentication } from './authentication'
import { getProfile } from './routes/get-profile'
import { authenticateFromLink } from './routes/authenticate-from-link'
import { getManagedstore } from './routes/get-managed-store'
import { signOut } from './routes/sign-out'
import { getOrderDetails } from './routes/get-order-details'
import { getMonthReceipt } from './routes/get-month-receipt'
import { getMonthOrdersAmount } from './routes/get-month-orders-amount'
import { getDayOrdersAmount } from './routes/get-day-orders-amount'
import { getMonthCanceledOrdersAmount } from './routes/get-month-canceled-orders-amount'
import { getDailyReceiptInPeriod } from './routes/get-daily-receipt-in-period'
import { getPopularProducts } from './routes/get-popular-products'
import { dispatchOrder } from './routes/dispatch-order'
import { deliverOrder } from './routes/deliver-order'
import { getFriendlyFace } from './routes/ friendly-face'

const app = new Elysia()
  .use(swagger())
  .use(getFriendlyFace)
  .use(authentication)
  .use(signOut)
  .use(getProfile)
  .use(getManagedstore)
  .use(registerStore)
  .use(registerCustomer)
  .use(sendAuthenticationLink)
  .use(authenticateFromLink)
  .use(createOrder)
  .use(approveOrder)
  .use(cancelOrder)
  .use(dispatchOrder)
  .use(deliverOrder)
  .use(getOrders)
  .use(getOrderDetails)
  .use(createEvaluation)
  .use(getEvaluations)
  .use(updateProducts)
  .use(updateProfile)
  .use(getMonthReceipt)
  .use(getMonthOrdersAmount)
  .use(getDayOrdersAmount)
  .use(getMonthCanceledOrdersAmount)
  .use(getDailyReceiptInPeriod)
  .use(getPopularProducts)

app.listen(3333)

console.log(
  `🔥 HTTP server running at ${app.server?.hostname}:${app.server?.port}`,
)
