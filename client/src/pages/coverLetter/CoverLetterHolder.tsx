import React from 'react';

interface Props {
  coverLetter: string;
}

const CoverLetterTemplate: React.FC<Props> = ({ coverLetter }) => {
  return (
    <div className="a4-size flex border-4 rounded border-black">
      <div className="p-10 w-full max-w-3xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold">Your Name</h1>
          <p>Your Address</p>
          <p>Your City, State ZIP Code</p>
          <p>Your Email</p>
          <p>Your Phone Number</p>
        </header>
        <main>
          <section className="mb-8">
            <p>Date: <span>{new Date().toLocaleDateString()}</span></p>
          </section>
          <section className="mb-8">
            <p>Recipient Name</p>
            <p>Recipient Title</p>
            <p>Company Name</p>
            <p>Company Address</p>
            <p>City, State ZIP Code</p>
          </section>
          <section>
          {coverLetter.split('\n').map((line, index) => (
            <p className="pb-4" key={index}>{line}</p>
          ))}
          </section>
        </main>
      </div>
    </div>
  );
};

export default CoverLetterTemplate;
