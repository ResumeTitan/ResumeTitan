import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from "@clerk/clerk-react";
import api from "api/actions";
import Spinner from 'components/Spinner';

interface Tier {
  name: string;
  id: string;
  href: string;
  price: {
    monthly: string;
    annually: string;
  };
  features: string[];
  cta: string;
}

const tiers: Tier[] = [
  {
    name: '7 Days',
    id: '7days',
    href: 'https://buy.stripe.com/5kAbKA39k0ct800eUY',
    price: { monthly: '$3', annually: '$5' },
    features: [
      'Unlimited Resume Downloads',
      'Unlimited AI Usage',
      'Access to premium tools',
    ],
    cta: 'Buy plan',
  },
  {
    name: '1 Month',
    id: '1month',
    href: '#',
    price: { monthly: '$10', annually: '$15' },
    features: [
      'Unlimited Resume Downloads',
      'Unlimited AI Usage',
      'Access to premium tools',
    ],
    cta: 'Buy plan',
  },
  {
    name: '6 Months',
    id: '6months',
    href: '#',
    price: { monthly: '$50', annually: '$75' },
    features: [
      'Unlimited Resume Downloads',
      'Unlimited AI Usage',
      'Access to premium tools',
    ],
    cta: 'Buy plan',
  },
];

const Pricing: React.FC = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [stripeLoading, setStripeLoading] = useState(false);

  const handleBuyButtonClick = async (planId: string) => {
    if (!isLoaded || !user) {
      navigate("/sign-in");
      return;
    }
    try {
      setStripeLoading(true);
      const response = await api.post("/checkout/session", {
        email: user.emailAddresses[0].emailAddress, 
        plan: planId
      });
      console.log(response);
      // @ts-ignore
      const url = response.data.sessionUrl;
      console.log(url);
      if (url) window.open(url, '_self');
    } catch (error) {
      alert('Something went wrong. Please try again');
    }

    setStripeLoading(false);
  };

  return (
    <div className="mx-auto mt-4 max-w-7xl p-4 sm:mt-8 sm:p-6 lg:mt-12 lg:p-8">
      {stripeLoading && (
        <Spinner />
      )}
      <div className="mx-auto flex max-w-4xl flex-col space-y-7 text-center">
        <h2 className="text-4xl font-bold leading-tight tracking-wide text-neutral-900 xl:text-5xl">
          Upgrade for Full Access
        </h2>

        <p className="text-lg text-neutral-600">
          Unlock the full power of ResumeTitan by subscribing for a premium plan. 
          Don't worry, we don't save your payment info, and we will not renew your subscription automatically.
        </p>
      </div>

      <div className="isolate mx-auto mt-8 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:mt-24 lg:max-w-none lg:grid-cols-3">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className="flex flex-col justify-between space-y-10 rounded-xl bg-white p-8 text-center ring-2 ring-neutral-500 xl:p-10"
          >
            <div>
              <h3
                id={tier.id}
                className="text-lg font-semibold leading-8 text-neutral-900"
              >
                {tier.name}
              </h3>

              <div className="mt-2 flex flex-col space-y-4">
                <p className="flex items-baseline justify-center gap-x-1">
                  <span className="text-5xl font-bold tracking-tight text-neutral-900">
                    {tier.price.monthly}
                  </span>
                  <span className="line-through	text-neutral-600">
                    {tier.price.annually}
                  </span>
                </p>
              </div>

              <ul
                className="mt-6 space-y-3 text-sm leading-6 text-neutral-600"
              >
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon
                      className="h-6 w-5 flex-none text-neutral-600"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleBuyButtonClick(tier.id)}
              className="rounded-md bg-main-green px-10 py-3 text-md font-semibold text-white shadow-sm hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500"
            >
              {tier.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  );
}

export default Pricing;
