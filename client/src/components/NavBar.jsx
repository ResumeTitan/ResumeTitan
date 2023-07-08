import React, { useState } from 'react';
import { useSelector } from "react-redux";

const NavBar = ({ links }) => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.user);

  return (
    <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-6">
      <div className="flex items-center flex-shrink-0  mr-6">
        <a href="/" className="font-bold text-xl tracking-tight text-white">
          ResumeGPT
        </a>
      </div>
      <div className="block lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center px-3 py-2 border rounded text-white border-white hover:text-teal-500 hover:bg-white"
        >
          <svg
            className="fill-current h-3 w-3"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path
              fillRule="evenodd"
              d="M2 5h16a1 1 0 110 2H2a1 1 0 110-2zm0 6h16a1 1 0 110 2H2a1 1 0 110-2zm0 6h16a1 1 0 110 2H2a1 1 0 110-2z"
            />
          </svg>
        </button>
      </div>
      <div
        className={`${
          isOpen ? 'block' : 'hidden'
        } w-full block flex-grow lg:flex lg:items-center lg:w-auto`}
      >
        {user && (
          <div className="text-sm lg:flex-grow">
          <a
            href={`/resume/${user.id}`}
            className="block mt-4 lg:inline-block lg:mt-0 text-gray-300 hover:text-white mr-4"
          >
            My Resume
          </a>
        </div>
        )}
        <div>
          <a
            href="/login"
            className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-gray-800 hover:bg-white mt-4 lg:mt-0"
          >
            Login
          </a>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
