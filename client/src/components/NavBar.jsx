import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import WhiteLogo from '../assets/logo-white.png';
import TextLogo from '../assets/text-logo-white.png';
import 'styles/index.css';
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";

const NavBar = () => {
  const [mobileScreen, setMobileScreen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); 
  const { user } = useUser();
  const isAuthRoute = location.pathname.includes("/sign-in") || location.pathname.includes("/sign-up"); // Determine if it's an auth route

  // let clerkUserId = "";
  // let name = "";
  // let email = "";
  // const { userClerk } = useUser();
  
  // if(userClerk) {
  //   clerkUserId = userClerk.id;
  //   name = userClerk.firstName + " " + userClerk.lastName;
  //   email = userClerk.emailAddresses[0].emailAddress;
  // }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setMobileScreen(true);
      } else {
        setMobileScreen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isAuthRoute) {
    return null;
  }

  const mobileNavbar = (
    <div className="lg:hidden">
      <button
        onClick={toggleMobileMenu}
        className="text-white focus:outline-none focus:border-none"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {isMobileMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          )}
        </svg>
      </button>

      {isMobileMenuOpen && (
        <div className="flex flex-col absolute top-16 right-0 bg-white border-2 border-black rounded-lg shadow-lg animate-slideUpFadeIn z-50">
          <button
            className="text-main-green font-bold p-4 w-full border-b-2 border-black text-left hover:bg-lightest-green transition ease-in-out duration-300"
            onClick={() => {
              setIsMobileMenuOpen(false);
              navigate('/docs');
            }}
          >
            {'User Guides'}
          </button>
          <SignedOut>
            <button
              className="text-main-green font-bold p-4 w-full border-b-2 border-black text-left hover:bg-lightest-green transition ease-in-out duration-300"
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate('/sign-in');
              }}
            >
              {'Sign In'}
            </button>
          </SignedOut>
          <SignedIn>
            <button
              className="text-main-green font-bold p-4 w-full border-b-2 border-black text-left hover:bg-lightest-green transition ease-in-out duration-300"
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate('/dashboard');
              }}
            >
              {'Dashboard'}
            </button>
            <button 
              className="p-4 border-b-2 border-black text-left hover:bg-lightest-green transition ease-in-out duration-300 flex items-center justify-between"
              onClick={() => {
                const userButton = document.querySelector('.cl-userButtonTrigger');
                if (userButton) {
                  userButton.click();
                }
              }}
            >
              <div className="flex items-center">
                <span className="text-main-green font-bold">Hello, </span>
                <span className="text-main-green ml-1">{user?.fullName || 'User'}</span>
              </div>
              <div className="ml-4">
                <UserButton afterSignOutUrl='/'/>
              </div>
            </button>
          </SignedIn>
        </div>
      )}
    </div>
  );

  return (
    <div className="no-print">
      <nav className="flex justify-between w-full items-center bg-main-green py-2 px-8 border-b-2 border-black z-40 relative">
        <div
          className={`flex items-center w-full ${
            mobileScreen ? 'justify-between' : ''
          }`}
        >
          <a
            href="/"
            className="font-outline-2 flex font-bold text-xl tracking-tight text-white"
          >
            {mobileScreen ? (
              <div className="flex items-center">
                <img width={50} height={50} src={WhiteLogo} alt="Logo" />
                <img width={150} src={TextLogo} alt="Logo" />
              </div>
            ) : (
              <div className="flex items-center">
                <img width={80} height={80} src={WhiteLogo} alt="Logo" />
                <img width={200} src={TextLogo} alt="Logo" />
              </div>
            )}
          </a>
        </div>
        {mobileScreen ? (
          mobileNavbar
        ) : (
          <div className="flex items-center">
            <button
              className="text-white font-bold pr-8"
              onClick={() => navigate('/docs')}
            >
              {'User Guides'}
            </button>
            <SignedOut>
              {/* <a
                className="text-white font-bold pr-8"
                href='/pricing'
              >
                {'Pricing'}
              </a> */}
              <a
                id="loginBtn"
                href="/sign-in"
                className="login-button"
              >
                {'Login'}
              </a>
            </SignedOut>
            <SignedIn>
              <button
                className="text-white font-bold pr-8"
                onClick={() => navigate('/dashboard')}
              >
                {'Dashboard'}
              </button>
              {/* <button
                className="text-white font-bold pr-8"
                onClick={() => navigate('/pricing')}
              >
                {'Pricing'}
              </button> */}
              <UserButton afterSignOutUrl='/' />
            </SignedIn>
          </div>
        )}
      </nav>
    </div>
  );
};

export default NavBar;
