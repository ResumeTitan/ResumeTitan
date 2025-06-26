import React from 'react';
import 'styles/index.css';

const AboutUs = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-main-green to-dark-green text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center" data-aos="fade-up">
            <h1 className="text-4xl font-bold leading-tight tracking-wide xl:text-5xl mb-6">
              About ResumeTitan
            </h1>
            <p className="text-xl text-lightest-green max-w-3xl mx-auto leading-relaxed">
              Empowering job seekers with AI-powered tools to create professional resumes, 
              compelling cover letters, and ace interviews with confidence.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Our Story Section */}
        <div className="mb-20" data-aos="fade-up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-neutral-600 leading-relaxed mb-6">
                At ResumeTitan, we're dedicated to simplifying the resume creation process and enhancing your career readiness. 
                Leveraging cutting-edge technology like GenAI, we provide a comprehensive suite of tools to streamline resume writing, 
                cover letter composition, and interview preparation.
              </p>
              <p className="text-lg text-neutral-600 leading-relaxed">
                With GenAI, we infuse your resumes with compelling phrases and sought-after skills, tailored to impress employers. 
                Continuously gathering feedback from diverse organizations, we understand the importance of AI in modern job searches 
                and strive to harness its power to expedite and elevate the resume creation journey.
              </p>
            </div>
            <div className="bg-lightest-green rounded-lg p-8">
              <div className="text-center">
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold text-main-green mb-2">
                  AI-Powered Excellence
                </h3>
                <p className="text-neutral-600">
                  Whether you're a seasoned professional or a recent graduate, 
                  let ResumeTitan be your ally in landing your dream job faster.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="mb-20" data-aos="fade-up" data-aos-delay="200">
          <div className="bg-gradient-to-r from-lightest-green to-lighter-green rounded-lg p-8 lg:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-main-green mb-4">
                The Founders Mission
              </h2>
              <div className="w-24 h-1 bg-main-green mx-auto"></div>
            </div>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-neutral-700 leading-relaxed mb-6">
                At ResumeTitan, our mission is clear: to accelerate the resume creation process. 
                Drawing from our experience as former hiring managers, we recognize the significance 
                of delivering quality, job-specific information to employers.
              </p>
              <p className="text-lg text-neutral-700 leading-relaxed mb-6">
                Our tool simplifies template selection, customizes each resume, and provides a scoring 
                mechanism to optimize your chances of securing interviews. Having worked with individuals 
                at all career stages, including GED students and professionals at Fortune 500 companies, 
                we're committed to offering a solution accessible to everyone.
              </p>
              <p className="text-lg text-neutral-700 leading-relaxed">
                In today's competitive job market, where uncertainties abound, maintaining an updated 
                resume is crucial. Our aim is to empower our users with a competitive edge during the 
                early stages of their job search journey.
              </p>
            </div>
          </div>
        </div>

        {/* Success Stories Section */}
        <div className="mb-20" data-aos="fade-up" data-aos-delay="400">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Success Stories
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Real results from real users who have transformed their job search with ResumeTitan
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Stat Card 1 */}
            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300" data-aos="zoom-in" data-aos-delay="100">
              <div className="text-4xl font-bold text-main-green mb-2">65%</div>
              <p className="text-neutral-600">weren't using any resume tool before ResumeTitan</p>
            </div>
            
            {/* Stat Card 2 */}
            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300" data-aos="zoom-in" data-aos-delay="200">
              <div className="text-4xl font-bold text-main-green mb-2">80%</div>
              <p className="text-neutral-600">rated our solution 4 or 5 stars out of 5</p>
            </div>
            
            {/* Stat Card 3 */}
            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300" data-aos="zoom-in" data-aos-delay="300">
              <div className="text-4xl font-bold text-main-green mb-2">95%</div>
              <p className="text-neutral-600">expressed willingness to continue using ResumeTitan</p>
            </div>
          </div>

          <div className="mt-12 bg-white rounded-lg shadow-lg p-8" data-aos="fade-up" data-aos-delay="500">
            <h3 className="text-2xl font-bold text-neutral-900 mb-6 text-center">
              Methodist University Case Study
            </h3>
            <p className="text-lg text-neutral-600 leading-relaxed">
              Collaborating with students at Methodist University, ResumeTitan conducted a user test involving 30 students, 
              revealing insightful feedback. Surprisingly, 65% of participants weren't utilizing any resume creation tool 
              prior to our solution. Impressively, 80% rated our solution with 4 or 5 stars on a scale of 1-5, showcasing 
              its effectiveness and user satisfaction.
            </p>
            <p className="text-lg text-neutral-600 leading-relaxed mt-4">
              Notably, 90% found our solution easy to navigate, while an overwhelming 95% expressed willingness to continue 
              using it beyond the test environment. Moreover, students displayed a positive outlook on the integration of AI 
              into society. Leveraging this feedback, ResumeTitan remains committed to refining and enhancing our tool, 
              ensuring an optimal user experience for students navigating their career paths.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center" data-aos="fade-up" data-aos-delay="600">
          <div className="bg-main-green rounded-lg p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Job Search?
            </h2>
            <p className="text-xl text-lightest-green mb-8 max-w-2xl mx-auto">
              Join thousands of job seekers who have already accelerated their careers with ResumeTitan
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/sign-up"
                className="primary-action-button text-lg bg-white text-main-green border-white hover:bg-lightest-green hover:text-main-green"
              >
                Get Started Free
              </a>
              <a
                href="/contact"
                className="primary-action-button text-lg bg-transparent text-white border-white hover:bg-white hover:text-main-green"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
