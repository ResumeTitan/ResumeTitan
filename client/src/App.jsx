import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import { useSelector } from "react-redux";
import HomePage from './scenes/homePage';
import LoginPage from './scenes/loginPage';
import ResumePage from './scenes/resumePage';

export default function App() {
  const isAuth = Boolean(useSelector((state) => state.token));

  return (
    <div className="min-h-screen bg-slate-600 ">
      <BrowserRouter>
      <NavBar links={["test", "otherTest", `${isAuth}`]}/>
      <Routes>
        <Route path="/" element={isAuth ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/resume/:id" element={isAuth ? <ResumePage /> : <Navigate to="/login" />} />
        {/* <Route path="/resume/:id/view" element={<Resume />} /> */}
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}
