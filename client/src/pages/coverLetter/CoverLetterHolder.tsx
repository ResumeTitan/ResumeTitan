import React from 'react';

const CoverLetterTemplate: React.FC = () => {
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
            <p className="mb-4">Dear [Recipient's Name],</p>
            <p className="mb-4">I am writing to express my interest in the [Job Title] position at [Company Name], as advertised on [Job Board/Company Website]. With my [Number] years of experience in [Your Field/Industry] and my skills in [Key Skill #1], [Key Skill #2], and [Key Skill #3], I am confident that I would be a valuable addition to your team.</p>
            <p className="mb-4">[Insert a paragraph about your previous experience and achievements]</p>
            <p className="mb-4">[Insert a paragraph about why you are excited about this role and how your skills align with the job requirements]</p>
            <p className="mb-4">Thank you for considering my application. I look forward to the opportunity to discuss my qualifications further. Please feel free to contact me at [Your Phone Number] or [Your Email Address] to schedule an interview.</p>
            <p className="mb-4">Sincerely,</p>
            <p>Your Name</p>
          </section>
        </main>
      </div>
    </div>
  );
};

export default CoverLetterTemplate;
