/**
 * This file contains the API calls to the server related 
 * to the subscription payments.
 */

const API_URL = process.env.REACT_APP_API_URL;

export const createStripeSession = async (
  email: string,
  plan: string,
) => {
  console.log("hit endpoint");
  const response = await fetch(`${API_URL}/checkout/session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, plan }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};
