import { clerkClient, stripeClient } from "../ext/clients";
import { Response, Request } from 'express';

const STRIPE_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

if (!STRIPE_SECRET) {
  throw new Error("Stripe Webhook secret not found")
}

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

  // Send session to frontend, await user payment before calling webhook
  const session = await stripeClient.checkout.sessions.create({
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

  // Update clerk client metadata, to be verified on webhook call
  // @ts-ignore
  const userId = req.auth.userId
  try {
    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: {
        stripeId: session.id,
      }
    })
    res.status(200).json({
      sessionId: session.id, 
      sessionUrl: session.url
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: e.msg });
  }
};


/**
 * @function webhook
 * @description Stripe webhook for handling post payment actions
 */
export const webhook = async (req: Request, res: Response) => {
  const payload = req.body;
  const payloadString = JSON.stringify(payload, null, 2);


  const header = stripeClient.webhooks.generateTestHeaderString({
    payload: payloadString,
    secret: STRIPE_SECRET,
  });

  let event;

  try {
    event = stripeClient.webhooks.constructEvent(payloadString, header, STRIPE_SECRET);
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        if (!session.metadata) {
          throw new Error("Metadata not found in session");
        }

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

        // TODO update metadata
        const data = await clerkClient.users.getUserList({ emailAddress: [session.customer_details.email] });
        if (data.totalCount === 0) {
          throw new Error("Could not find user by email");
        }

        const customerId = session.id;
        const clerkId = data.data[0].id;

        await clerkClient.users.updateUser(clerkId, {
          publicMetadata: {
            premiumUntil: premiumEndDate.toString()
          },
          privateMetadata: {
            stripeId: customerId
          }
        });
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

