import React from 'react';
import 'styles/index.css';

const PrivacyPolicy = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-main-green to-dark-green text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center" data-aos="fade-up">
            <h1 className="text-4xl font-bold leading-tight tracking-wide xl:text-5xl mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-lightest-green max-w-3xl mx-auto leading-relaxed">
              How we protect your personal information and ensure your privacy 
              while using ResumeTitan's services
            </p>
            <div className="mt-6 text-lightest-green">
              <span className="text-sm">Last Updated: October 20, 2023</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8 lg:p-12" data-aos="fade-up">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-main-green mb-6">
              Privacy Policy for ResumeTitan
            </h2>
            
            <p className="text-lg text-neutral-600 leading-relaxed mb-6">
              At ResumeTitan, accessible from www.resumetitan.com, one of our main priorities is the privacy of our visitors. 
              This Privacy Policy document contains types of information that is collected and recorded by ResumeTitan and how we use it.
            </p>
            
            <p className="text-lg text-neutral-600 leading-relaxed mb-8">
              If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
            </p>

            <div className="space-y-8">
              {/* Log Files Section */}
              <div className="bg-lightest-green rounded-lg p-6">
                <h3 className="text-xl font-bold text-main-green mb-4">
                  Log Files
                </h3>
                <p className="text-neutral-700 leading-relaxed">
                  ResumeTitan follows a standard procedure of using log files. These files log visitors when they visit websites. 
                  All hosting companies do this and a part of hosting services' analytics. The information collected by log files 
                  include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, 
                  referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally 
                  identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' 
                  movement on the website, and gathering demographic information.
                </p>
              </div>

              {/* Cookies Section */}
              <div className="bg-lightest-green rounded-lg p-6">
                <h3 className="text-xl font-bold text-main-green mb-4">
                  Cookies and Web Beacons
                </h3>
                <p className="text-neutral-700 leading-relaxed mb-4">
                  Like any other website, ResumeTitan uses "cookies". These cookies are used to store information including 
                  visitors' preferences, and the pages on the website that the visitor accessed or visited. The information 
                  is used to optimize the users' experience by customizing our web page content based on visitors' browser 
                  type and/or other information.
                </p>
                <p className="text-neutral-700 leading-relaxed">
                  For more general information on cookies, please read{' '}
                  <a href="https://www.privacypolicyonline.com/what-are-cookies/" 
                     className="text-main-green hover:text-dark-green underline">
                    the "Cookies" article from the Privacy Policy Generator
                  </a>.
                </p>
              </div>

              {/* Privacy Policies Section */}
              <div className="bg-lightest-green rounded-lg p-6">
                <h3 className="text-xl font-bold text-main-green mb-4">
                  Privacy Policies
                </h3>
                <p className="text-neutral-700 leading-relaxed mb-4">
                  You may consult this list to find the Privacy Policy for each of the advertising partners of ResumeTitan.
                </p>
                <p className="text-neutral-700 leading-relaxed mb-4">
                  Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are 
                  used in their respective advertisements and links that appear on ResumeTitan, which are sent directly to 
                  users' browser. They automatically receive your IP address when this occurs. These technologies are used 
                  to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content 
                  that you see on websites that you visit.
                </p>
                <p className="text-neutral-700 leading-relaxed">
                  Note that ResumeTitan has no access to or control over these cookies that are used by third-party advertisers.
                </p>
              </div>

              {/* Third Party Privacy Policies Section */}
              <div className="bg-lightest-green rounded-lg p-6">
                <h3 className="text-xl font-bold text-main-green mb-4">
                  Third Party Privacy Policies
                </h3>
                <p className="text-neutral-700 leading-relaxed mb-4">
                  ResumeTitan's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you 
                  to consult the respective Privacy Policies of these third-party ad servers for more detailed information. 
                  It may include their practices and instructions about how to opt-out of certain options.
                </p>
                <p className="text-neutral-700 leading-relaxed">
                  You can choose to disable cookies through your individual browser options. To know more detailed information 
                  about cookie management with specific web browsers, it can be found at the browsers' respective websites.
                </p>
              </div>

              {/* Children's Information Section */}
              <div className="bg-lightest-green rounded-lg p-6">
                <h3 className="text-xl font-bold text-main-green mb-4">
                  Children's Information
                </h3>
                <p className="text-neutral-700 leading-relaxed mb-4">
                  Another part of our priority is adding protection for children while using the internet. We encourage 
                  parents and guardians to observe, participate in, and/or monitor and guide their online activity.
                </p>
                <p className="text-neutral-700 leading-relaxed">
                  ResumeTitan does not knowingly collect any Personal Identifiable Information from children under the age of 13. 
                  If you think that your child provided this kind of information on our website, we strongly encourage you to 
                  contact us immediately and we will do our best efforts to promptly remove such information from our records.
                </p>
              </div>

              {/* Online Privacy Policy Only Section */}
              <div className="bg-lightest-green rounded-lg p-6">
                <h3 className="text-xl font-bold text-main-green mb-4">
                  Online Privacy Policy Only
                </h3>
                <p className="text-neutral-700 leading-relaxed">
                  This Privacy Policy applies only to our online activities and is valid for visitors to our website with 
                  regards to the information that they shared and/or collect in ResumeTitan. This policy is not applicable 
                  to any information collected offline or via channels other than this website.
                </p>
              </div>

              {/* Consent Section */}
              <div className="bg-lightest-green rounded-lg p-6">
                <h3 className="text-xl font-bold text-main-green mb-4">
                  Consent
                </h3>
                <p className="text-neutral-700 leading-relaxed">
                  By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-lightest-green py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-main-green mb-4">
            Questions About Your Privacy?
          </h2>
          <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
            We're committed to transparency about how we handle your data. 
            If you have any questions about our privacy practices, please reach out.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="primary-action-button text-lg bg-main-green text-white border-main-green hover:bg-dark-green hover:border-dark-green"
            >
              Contact Us
            </a>
            <a
              href="/terms"
              className="primary-action-button text-lg bg-transparent text-main-green border-main-green hover:bg-main-green hover:text-white"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
