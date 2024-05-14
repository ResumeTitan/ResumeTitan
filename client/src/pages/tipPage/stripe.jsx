import React from 'react';

const BuyButtonComponent = ({ amount }) => {
  return (
    <div>
      <stripe-buy-button
        buy-button-id="buy_btn_1PGOAURw7PDAUEDyamsdrUxR"
        publishable-key="pk_live_51P1IU6Rw7PDAUEDyAC5YsNwZrZWni934ouUetx9jGfeN6s9o4ELOMbgul6BTDlhTuSgQRoBybMXKFJqt8ZBDA0Ef00mBpfBjAO"
      >
      </stripe-buy-button>
    </div>
  );
};

export default BuyButtonComponent;
