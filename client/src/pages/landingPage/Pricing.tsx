import React from 'react';

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
    id: 'tier-basic',
    href: '#',
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
    id: 'tier-premium',
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
    id: 'tier-enterprise',
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
  return (
    <div className="mx-auto mt-24 max-w-7xl px-4 sm:mt-32 sm:px-6 lg:mt-40 lg:px-8">
      <div className="mx-auto flex max-w-4xl flex-col space-y-7 text-center">
        <h2 className="text-4xl font-bold leading-tight tracking-wide text-neutral-900 dark:text-neutral-50 xl:text-5xl">
          Upgrade for full access
        </h2>

        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Unlock the full power of ResumeTitan by subscribing for a premium plan. 
          Don't worry, we don't save your payment info, and we will not renew your subscription automatically.
        </p>
      </div>

      <div className="isolate mx-auto mt-14 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:mt-24 lg:max-w-none lg:grid-cols-3">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className="flex flex-col justify-between space-y-10 rounded-xl bg-white p-8 text-center ring-1 ring-neutral-200 dark:bg-neutral-950 dark:ring-neutral-800 xl:p-10"
          >
            <div>
              <h3
                id={tier.id}
                className="text-lg font-semibold leading-8 text-neutral-900 dark:text-neutral-200"
              >
                {tier.name}
              </h3>

              <div className="mt-2 flex flex-col space-y-4">
                <p className="flex items-baseline justify-center gap-x-1">
                  <span className="text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    {tier.price.monthly}
                  </span>
                  <span className="line-through	text-neutral-600 dark:text-neutral-500">
                    {tier.price.annually}
                  </span>
                </p>
              </div>

              <ul
                role="list"
                className="mt-6 space-y-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300"
              >
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon
                      className="h-6 w-5 flex-none text-neutral-600 dark:text-neutral-400"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <a
              href={tier.href}
              aria-describedby={tier.id}
              className="rounded-md bg-neutral-900 px-10 py-3 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-300 dark:focus-visible:outline-neutral-400"
            >
              {tier.cta}
            </a>
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
