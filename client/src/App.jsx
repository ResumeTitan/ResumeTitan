import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import { useSelector } from "react-redux";
import HomePage from './scenes/homePage';
import LoginPage from './scenes/loginPage';
import ResumePage from './scenes/resumePage';
import Resume from './scenes/Resume';

export default function App() {
  const isAuth = Boolean(useSelector((state) => state.token));
  let links = [];
  if (isAuth) {
    links = [""];
  }

  return (
    <div className="min-h-screen bg-slate-600 ">
      <BrowserRouter>
      <NavBar links={["test", "otherTest", `${isAuth}`]}/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/resume/:id" element={<ResumePage />} />
        {/* <Route path="/resume/:id/view" element={<Resume />} /> */}
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}
