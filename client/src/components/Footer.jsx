export default function Footer() {
  return (
    <footer className="bg-main-green text-white p-2">
      <div className="w-full mx-auto max-w-screen-xl sm:p-2 p-4 md:flex md:items-center md:justify-between">
        <span className="text-md sm:text-center">&#169; ResumeTitan {new Date().getFullYear()}</span>
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
