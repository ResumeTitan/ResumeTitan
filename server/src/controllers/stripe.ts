import User from "models/User";
import Stripe from "stripe";
import { Response, Request } from 'express';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Stripe Secret not found")
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * @function createCheckoutSession
 * @description return a checkout session page for the user to sign up through
 * @param {Request} req
 * @param {Resposne} res
 */
export const createCheckoutSession = async (req: Request, res: Response) => {
  const { plan, email } = req.body;
  let planAsString, price;
  switch (plan) {
    case '7days':
      price = 300;
      planAsString = "7 Day";
      break;
    case '1month':
      price = 1000;
      planAsString = "1 Month";
      break;
    case '6months':
      price = 5000;
      planAsString = "6 Month";
      break;
    default:
      return res.status(400).json({ message: 'Invalid plan' });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `ResumeTitan ${planAsString} Subscription`,
          },
          unit_amount: price,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    automatic_tax: { enabled: true },
    customer_email: email,
    success_url: `${process.env.CLIENT_URL}/success`,
    cancel_url: `${process.env.CLIENT_URL}/dashboard`,
    metadata: {
      subscription: plan
    }
  });

  res.json({ 
    sessionId: session.id, 
    sessionUrl: session.url
  });
};


/**
 * @function webhook
 * @description Stripe webhook for handling post payment actions
 */
export const webhook = async (req: Request, res: Response) => {
  const payload = req.body;
  const payloadString = JSON.stringify(payload, null, 2);
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("Stripe Webhook secret not found")
  }
  const header = stripe.webhooks.generateTestHeaderString({
    payload: payloadString,
    secret,
  });

  let event;

  try {
    event = stripe.webhooks.constructEvent(payloadString, header, secret);
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        if (!session.metadata) {
          throw new Error("Metadata not found in session");
        }
        console.log('session', session.metadata.subscription);

        // Update user with new premium end date
        let premiumEndDate = new Date();
        switch (session.metadata.subscription) {
          case '7days':
            premiumEndDate.setDate(premiumEndDate.getDate() + 7);
            break;
          case '1month':
            premiumEndDate.setMonth(premiumEndDate.getMonth() + 1);
            break;
          case '6months':
            premiumEndDate.setMonth(premiumEndDate.getMonth() + 6);
            break;
          default:
            console.log(`Unhandled subscription type ${session.metadata.subscription}`);
        }
        // @ts-ignore
        await User.findOneAndUpdate({ email: session.customer_details.email }, { $set: { premiumUntil: premiumEndDate } });
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
      }
  } catch (err: any) {
    console.error('Error verifying webhook:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  res.json({ received: true });
}

