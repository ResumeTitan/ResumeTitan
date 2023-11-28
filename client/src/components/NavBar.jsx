import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLogout } from 'state';
import WhiteLogo from '../assets/logo-white.png';
import TextLogo from '../assets/text-logo-white.png';
import '../index.css';
import { LoginForm } from './LoginForm';

const NavBar = () => {
  const user = useSelector((state) => state.user);
  const [mobileScreen, setMobileScreen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoginLogout = () => {
    setIsMobileMenuOpen(false);
    if (user) {
      dispatch(setLogout());
      navigate('/');
    } else {
      setIsLoginOpen(true);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
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
        <div className="absolute top-16 rounded right-0 bg-gray-800 py-2 px-4">
          <button
            href="/login"
            onClick={handleLoginLogout}
            className="block text-white py-2"
          >
            {user ? 'Logout' : 'Login'}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <nav className="flex justify-between w-full items-center bg-main-green py-2 px-8">
        <div
          className={`flex items-center w-full ${
            mobileScreen ? 'justify-between' : ''
          }`}
        >
          <a
            href="/dashboard"
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
              href="/login"
              className="text-md px-2 py-2 font-bold leading-none border border-4 rounded text-white border-white hover:border-transparent hover:bg-white hover:text-teal-800 items-center transition duration-300 ease-in-out"
              onClick={handleLoginLogout}
            >
              {user ? 'Logout' : 'Login'}
            </button>
          </div>
        )}
      </nav>

      {isLoginOpen && (
        <LoginForm
          onCloseLogin={() => {
            console.log('Closing login');
            setIsLoginOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default NavBar;
