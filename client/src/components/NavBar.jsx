import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLogout } from 'state';
import WhiteLogo from '../assets/logo-white.png';
import TextLogo from '../assets/text-logo-white.png';
import '../index.css';

const NavBar = () => {
  const user = useSelector((state) => state.user);
  const [mobileScreen, setMobileScreen] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoginLogout = () => {
    if (user) {
      dispatch(setLogout());
      navigate('/');
    } else {
      navigate('/login');
    }
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

  return (
    <nav className="flex justify-between w-full items-center bg-main-green py-2 px-8">
      <div
        className={`flex items-center w-full ${
          mobileScreen ? 'justify-center' : ''
        }`}
      >
        <a
          href="/"
          className="font-outline-2 flex font-bold text-xl tracking-tight text-white"
        >
          <div className="flex items-center">
            <img width={80} height={80} src={WhiteLogo} alt="Logo" />
            <img width={200} src={TextLogo} alt="Logo" />
          </div>
        </a>
      </div>
      {!mobileScreen && (
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
  );
};

export default NavBar;
