import React from 'react';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';

const SaaSHubBadge: React.FC = () => {
  return (
    <a
      href="https://www.saashub.com/resumetitan?utm_source=badge&utm_campaign=badge&utm_content=resumetitan&badge_variant=color&badge_kind=approved"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src="https://cdn-b.saashub.com/img/badges/approved-color.png?v=1"
        alt="ResumeTitan badge"
        style={{ maxWidth: '150px' }}
      />
    </a>
  );
};

export default function Footer() {
  return (
    <footer className="bg-main-green text-white p-2 no-print">
      <div className="w-full mx-auto max-w-screen-xl sm:p-2 p-4 md:flex md:items-center md:justify-between">
        <div>
          <span className="text-md sm:text-center">&#169; ResumeTitan {new Date().getFullYear()}</span>
          <YouTubeIcon className="m-2 text-white" />
          <LinkedInIcon className="text-white" />
          <XIcon className="m-2 text-white" />
          <SaaSHubBadge />
        </div>
        <ul className="block md:flex md:flex-wrap items-center mt-3 text-sm font-medium text-gray-500 sm:mt-0 list-none">
          <li>
            <a href="/about" className="text-gray-100 pr-4">
              About Us
            </a>
          </li>
          <li>
            <a href="/terms" className="text-gray-100 pr-4">
              Terms of Service
            </a>
          </li>
          <li>
            <a href="/privacy" className="text-gray-100 pr-4">
              Privacy Policy
            </a>
          </li>
          <li>
            <a href="/contact" className="text-gray-100 pr-4">
              Contact Us
            </a>
          </li>
          <li>
            <a href="/survey" className="text-gray-100">
              Have Feedback?
            </a>
          </li>
        </ul>
        </div>
    </footer>
  );
}
