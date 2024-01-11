export default function Footer() {
  return (
    <footer className="bg-white p-2 inset-x-0 bottom-0">
      <div className="w-full mx-auto max-w-screen-xl sm:p-2 p-4 md:flex md:items-center md:justify-between">
        <span className="text-md text-gray-500 sm:text-center">&#169; ResumeTitan {new Date().getFullYear()}</span>
        <ul className="block md:flex md:flex-wrap items-center mt-3 text-sm font-medium text-gray-500 sm:mt-0 list-none">
        <li>
          <a href="/terms" className="text-gray-600 pr-4">
            Terms of Service
          </a>
        </li>
        <li>
          <a href="/contact" className="text-gray-600 pr-4">
            Contact Us
          </a>
        </li>
        <li>
          <a href="/survey" className="text-gray-600">
            Have Feedback?
          </a>
        </li>
        </ul>
        </div>
    </footer>
  );
}
