import React from 'react';
import About from './About';
import Hero from './Hero';
import IntroPage from './IntroPage';
// import Metrics from './Metrics';
// import Logos from './Logos/Logos';
// import Pricing from 'components/Pricing';
import 'styles/index.css';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-white overflow-x-hidden pb-10">
      <IntroPage />
      <Hero />
      {/* <Logos /> */}
      <About />
      {/* <Metrics /> */}
      {/* <div data-aos="fade-right">
        <Pricing />
      </div> */}
      {/* <Blogs /> */}
    </div>
  );
};

export default LandingPage;
