import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import { useSelector } from "react-redux";
import HomePage from './scenes/homePage';
import LoginPage from './scenes/loginPage';
import ResumePage from './scenes/resumePage';
import ActionPage from './scenes/actionPage';
import LandingPage from './scenes/landingPage';

export default function App() {
  const isAuth = Boolean(useSelector((state) => state.token));
  return (
    <div className="min-h-screen bg-background-light">
      <BrowserRouter>
      <NavBar/>
      <Routes>
        <Route path="/home" element={isAuth ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/resume" element={isAuth ? <ResumePage /> : <Navigate to="/login" />} />
        {/* <Route path="/resume/:id/view" element={<Resume />} /> */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/test" element={<ActionPage />} />
        <Route path="/landing" element={<LandingPage />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}
