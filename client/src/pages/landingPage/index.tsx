import React from 'react';
import About from './About';
import Hero from './Hero';
// import Logos from './Logos/Logos';
import Pricing from './Pricing';

const LandingPage: React.FC = () => {
  return (
    <div className="py-10 bg-background-dark">
      <Hero />
      {/* <Logos /> */}
      <About />
      <Pricing />
      {/* <Blogs /> */}
    </div>
  );
};

export default LandingPage;
