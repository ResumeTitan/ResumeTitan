import React from 'react';
import NavBar from './components/NavBar';
import { useSelector } from "react-redux";

export default function App({ children }) {
  const isAuth = Boolean(useSelector((state) => state.token));

  return (
    <div className="min-h-screen bg-slate-600 ">
      <NavBar links={["test", "otherTest", `${isAuth}`]}/>
      {children}
    </div>
  );
}
