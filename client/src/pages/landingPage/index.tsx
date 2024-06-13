import React from 'react';
import About from './About';
import Hero from './Hero';
// import Logos from './Logos/Logos';
import Pricing from 'components/Pricing';
import 'styles/index.css';

const LandingPage: React.FC = () => {
  return (
    <div className="py-10 bg-white overflow-x-hidden">
      <Hero />
      {/* <Logos /> */}
      <About />
      <Pricing />
      {/* <Blogs /> */}
    </div>
  );
};

export default LandingPage;
