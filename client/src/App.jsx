import React from 'react';
import Footer from 'components/Footer';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import ActionPage from './pages/actionPage';
import TermsPage from './pages/termsPage';
import PrivacyPolicy from './pages/privacyPolicy';
import LandingPage from './pages/landingPage';
import ContactPage from './pages/contact';
import InterviewPage from './pages/interviewHelper';
import TipPage from './pages/tipPage';
import { PrintToPdf } from 'pages/printPage';
import { Survey } from './pages/survey';
import { Dashboard } from './pages/dashboard';
import AboutUs from 'pages/aboutUs';

export default function App() {
  return (
    <div className="min-h-screen h-screen">
      <BrowserRouter>
        {!window.location.pathname.includes('/print-resume') && <NavBar />}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/resume" element={<ActionPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Navigate to="/" />} />
          <Route path="/survey" element={<Survey />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/tip" element={<TipPage />} />
          <Route path="/print-resume/:id" element={<PrintToPdf />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        {!window.location.pathname.includes('/print-resume') && <Footer />}
      </BrowserRouter>
    </div>
  );
}
