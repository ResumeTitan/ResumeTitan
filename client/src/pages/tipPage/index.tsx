import React, { useState } from "react";
import BuyButtonComponent from "./stripe";

const TipPage: React.FC = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  return (
    <div className="bg-slate-700 flex flex-col items-center min-h-screen py-2 lg:py-8 bg-gray-100">
      <div className="w-full max-w-lg px-4 py-8 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-4">Leave us a tip</h1>
        <p className="text-gray-600 text-center mb-8">
          Thank you for supporting ResumeTitan. Your contribution 
          helps us continue to improve our site to bring you the best 
          resume creation experience possible.
        </p>
        {/* Message board */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">Leave a Message</h2>
          {messages.map((msg, index) => (
            <div key={index} className="bg-gray-200 px-4 py-2 rounded-md mb-2">
              {msg}
            </div>
          ))}
          {/* Message input fields */}
          <textarea
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
            rows={4}
            placeholder="Type your message here..."
            value={message}
            onChange={handleMessageChange}
          />
        </div>
        <div className="flex flex-row justify-center items-center">
          {/* Coffee button */}
          <BuyButtonComponent amount={0}/>
        </div>
      </div>
    </div>
  );
};

export default TipPage;

