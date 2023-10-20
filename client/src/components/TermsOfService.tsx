import React from 'react';

interface TermsOfServiceProps {
  onAccept: () => void;
  onDecline: () => void;
  onClose: () => void;
}

export const TermsOfService = ({ onAccept, onDecline }: TermsOfServiceProps) => {
  return (
  <div id="defaultModal" className="fixed inset-0 flex justify-center items-center z-50">
    <div className="relative w-full max-w-screen-lg max-h-screen overflow-y-auto p-4">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Terms of Service
                </h3>
                <button type="button" onClick={onDecline} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor"  strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
            </div>
            <div className="p-6 space-y-6 max-h-25 overflow-y-auto">
              <p className="text-base font-bold leading-relaxed text-gray-500 dark:text-gray-400">
                Last Updated: 10/17/2023
              </p>
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                Welcome to ResumeTitan!
              </p>
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                These Terms of Service ("Terms") govern your use of ResumeTitan operated by ResumeTitanLLC. By accessing or using ResumeTitan, you agree to be bound by these Terms. If you do not agree with any part of these Terms, you may not use ResumeTitan.
              </p>

              <p className="text-base font-bold leading-relaxed text-gray-500 dark:text-gray-400">
              1. Use of the Website
              </p>
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                (a) You must be at least 18 years old to use the Website.
              </p>
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                (b) You agree to provide accurate and complete information when using the Website.
              </p>
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                (c) You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
              </p>

              <p className="text-base font-bold leading-relaxed text-gray-500 dark:text-gray-400">
              2. Data Storage
              </p>
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                (a) The Website may collect and store information provided by users. This information may include, but is not limited to, personal details, preferences, and usage data.
              </p>
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                (b) We take reasonable measures to protect your data, but we cannot guarantee absolute security.
              </p>
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                (c) By using the Website, you consent to the collection, storage, and processing of your information as described in our Privacy Policy.
              </p>

              <p className="text-base font-bold leading-relaxed text-gray-500 dark:text-gray-400">
              3. External API
              </p>
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                (a) The Website may interact with external APIs to provide certain features or services.
              </p>
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                (b) Your use of the Website constitutes consent to share necessary information with external APIs in accordance with our Privacy Policy.
              </p>
              <p className="text-base font-bold leading-relaxed text-gray-500 dark:text-gray-400">
              4. Intellectual Property
              </p>
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                (a) The Website and its contents are protected by intellectual property laws. You may not use, reproduce, or distribute any part of the Website without our express written consent.
              </p>
              <p className="text-base font-bold leading-relaxed text-gray-500 dark:text-gray-400">
              5. Limitation of Liability
              </p>
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                (a) We are not liable for any damages or losses resulting from your use of the Website.
              </p>
              <p className="text-base font-bold leading-relaxed text-gray-500 dark:text-gray-400">
              6. Termination
              </p>
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                (a) We may terminate or suspend your access to the Website at any time without notice for any reason.
              </p>
              <p className="text-base font-bold leading-relaxed text-gray-500 dark:text-gray-400">
              7. Changes to Terms
              </p>
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                (a) We reserve the right to modify these Terms at any time. The updated version will be effective upon posting on the Website.
              </p>
              <p className="text-base font-bold leading-relaxed text-gray-500 dark:text-gray-400">
              8. Governing Law
              </p>
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                (a) These Terms are governed by the laws of the United States of America.
              </p>
              <p className="text-base font-bold leading-relaxed text-gray-500 dark:text-gray-400">
              9. Contact Us
              </p>
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                (a) If you have any questions or concerns about these Terms, please contact us at info@resumetitan.com.
              </p>
            </div>
            <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button type="button" onClick={onAccept} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">I accept</button>
                <button type="button" onClick={onDecline} className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Decline</button>
            </div>
        </div>
    </div>
  </div>
  )
}