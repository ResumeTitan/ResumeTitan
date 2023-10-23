export default function Footer() {
  return (
    <footer class="flex flex-cols justify-between bg-white py-4 text-center absolute w-full">
      <div class="container text-center">
        <p class="text-gray-600">
          &#169; ResumeTitan {new Date().getFullYear()}
          </p>
        </div>
        <div className="container">
          <a href="/terms" class="text-gray-600 pr-4">
            Terms of Service
          </a>
          <a href="/contact" class="text-gray-600">
            Contact Us
          </a>
        </div>
    </footer>
  );
}
