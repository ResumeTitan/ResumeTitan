import React from 'react';
import { useSelector } from 'react-redux';
import { createStripeSession } from 'api/stripe';

const BuyButtonComponent = ({ amount }) => {
  const currentUser = useSelector((state) => state.user);

  async function handleTipClick() {
    try {
      const response = await createStripeSession(currentUser.email, "7days");
      const url = response.sessionUrl;
      if (url) window.open(url, '_self');
    } catch (error) {
      alert('Something went wrong. Please try again');
    }
  }

  return (
    <div>
      {/* <stripe-buy-button
        buy-button-id="buy_btn_1PGOAURw7PDAUEDyamsdrUxR"
        publishable-key="pk_live_51P1IU6Rw7PDAUEDyAC5YsNwZrZWni934ouUetx9jGfeN6s9o4ELOMbgul6BTDlhTuSgQRoBybMXKFJqt8ZBDA0Ef00mBpfBjAO"
      >
      </stripe-buy-button> */}

      <button onClick={handleTipClick}>
        Buy {amount} credits
      </button>
    </div>
  );
};

export default BuyButtonComponent;
