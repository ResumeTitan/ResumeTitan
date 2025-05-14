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
import SuccessPage from './pages/paymentSuccess';
import PricingPage from './pages/pricing';
import CoverLetterPage from './pages/coverLetter';
import { PrintToPdf } from 'pages/printPage';
import { Survey } from './pages/survey';
import { Dashboard } from './pages/dashboard';
import AboutUs from 'pages/aboutUs';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { SignIn, SignUp } from '@clerk/clerk-react';

AOS.init({
  duration: 500
});

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
          <Route path="/print-resume/:id" element={<PrintToPdf />} />
          <Route path="/success" element={<SuccessPage />} />
          {/* <Route path="/pricing" element={<PricingPage />} /> */}
          <Route path="/cover-letter" element={<CoverLetterPage />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
        {!window.location.pathname.includes('/print-resume') && <Footer />}
      </BrowserRouter>
    </div>
  );
}
