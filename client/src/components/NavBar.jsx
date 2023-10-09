import React from 'react';
import { useSelector } from "react-redux";
import { setLogout } from 'state';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import WhiteLogo from '../assets/logo-white.png';
import ShieldLogo from '../assets/shield-logo-white.png';
import TextLogo from '../assets/text-logo-white.png';
import '../index.css';

const NavBar = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoginLogout = () => {
    if (user) {
      dispatch(setLogout());
      // TODO change to / when landing page is created
      navigate('/login');
    } else {
      navigate('/login');
    }
  }

  return (
    <nav className="flex justify-between bg-main-green py-2 px-8">
      <div className="flex flex-cols items-center flex-shrink-0  mr-6">
        <a href="/home" className="font-outline-2 flex items-center font-bold text-xl tracking-tight text-white">
          <div className="flex flex-cols items-center">
            <img width={64} height={64} src={ShieldLogo} alt="Logo" className="flex flex-cols items-center"/>
            <img width={200}  src={TextLogo} alt="Logo" className="flex flex-cols items-center"/>
          </div>
        </a>
      </div>
      <div className="flex items-center align-center">
        <button
          href="/login"
          className="text-md px-2 py-2 font-bold leading-none border border-4 rounded text-white border-white hover:border-transparent hover:bg-white hover:text-teal-800 items-center transition duration-300 ease-in-out"
          onClick={handleLoginLogout}
        >
          {user ? "Logout" : "Login"}
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
