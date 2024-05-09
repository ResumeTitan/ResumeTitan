import React from 'react';

const BuyButtonComponent = ({ amount }) => {
  return (
    <div>
      {/* {amount === 5 && (
        <stripe-buy-button
          buy-button-id="buy_btn_1PEFOeRw7PDAUEDyOv6rD4j5"
          publishable-key="pk_live_51P1IU6Rw7PDAUEDyAC5YsNwZrZWni934ouUetx9jGfeN6s9o4ELOMbgul6BTDlhTuSgQRoBybMXKFJqt8ZBDA0Ef00mBpfBjAO"
        >
        </stripe-buy-button>
      )}
      {amount === 15 && (
        <stripe-buy-button
          buy-button-id="buy_btn_1PEFiIRw7PDAUEDys8zSdNhn"
          publishable-key="pk_live_51P1IU6Rw7PDAUEDyAC5YsNwZrZWni934ouUetx9jGfeN6s9o4ELOMbgul6BTDlhTuSgQRoBybMXKFJqt8ZBDA0Ef00mBpfBjAO"
        >
        </stripe-buy-button>
      )}
      {amount === 25 && (
        <stripe-buy-button
          buy-button-id="buy_btn_1PEFjyRw7PDAUEDymxU7pB64"
          publishable-key="pk_live_51P1IU6Rw7PDAUEDyAC5YsNwZrZWni934ouUetx9jGfeN6s9o4ELOMbgul6BTDlhTuSgQRoBybMXKFJqt8ZBDA0Ef00mBpfBjAO"
        >
        </stripe-buy-button>
      )} */}
      <stripe-buy-button
        buy-button-id="buy_btn_1PEGGgRw7PDAUEDyZVCNcr6s"
        publishable-key="pk_test_51P1IU6Rw7PDAUEDyhLyM9lHkpOyelzpDtFmpM0wUtDp3vkP8FZbZEmOHGpIeesH8jTNrmMF4qchQdozb2rEOD8v300e6gkVqx9"
      >
      </stripe-buy-button>
    </div>
  );
};

export default BuyButtonComponent;
