import { config } from 'dotenv'
config() // Before anything else, set the environment variables



import express from 'express'
import cors from 'cors'
import Stripe from 'stripe'
import { env } from './utils/env'



// Data

import itemsDB from './data/items.json'



// Create application

const app = express()
const stripe = new Stripe(env('STRIPE_SECRET_API_KEY'), { apiVersion: '2020-08-27' })



// Middlewares

app.use(cors())
app.use(express.json())



// Routes

app.post('/create-checkout-session', async (req, res) => {

  try {

    const line_items = getLineItems(req.body.items)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: 'SUCCESS_URL',
      cancel_url: 'CANCEL_URL',
      line_items
    })

    res.send({ url: session.url })

  } catch (err: any) {

    res.status(500).send(err)

  }

})



// Start server

app.listen(env('PORT', '3000'))



// Util

/** Converts the raw items data sent by the client to usable data for the Stripe API */
function getLineItems (itemsData: any): Stripe.Checkout.SessionCreateParams.LineItem[] {

  return itemsData.map(data => {

    const item = itemsDB.find(item => item.id === data.id)

    if (!item) {
      throw new Error(`Unknown item ID ${data.id}`)
    }

    return {
      quantity: data.amount,
      price_data: {
        currency: 'usd',
        unit_amount: item.priceInCents,
        product_data: {
          name: item.name
        },
      }
    }

  })

}
