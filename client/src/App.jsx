import React from 'react';
import Footer from 'components/Footer';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar';
import ChatBot from './components/ChatBot/ChatBot';
import ActionPage from './pages/actionPage';
import TermsPage from './pages/termsPage';
import PrivacyPolicy from './pages/privacyPolicy';
import LandingPage from './pages/landingPage';
import ContactPage from './pages/contact';
import InterviewPage from './pages/interviewHelper';
import SuccessPage from './pages/paymentSuccess';
// import PricingPage from './pages/pricing';
import CoverLetterPage from './pages/coverLetter';
import PrintPage from 'pages/printPage/PrintPage';
import { Survey } from './pages/survey';
import { Dashboard } from './pages/dashboard';
import AboutUs from 'pages/aboutUs';
import DocsPage from './pages/docs';
import DynamicDocsPage from './pages/docs/DynamicDocsPage';
import MetricsPage from './pages/metrics';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { SignIn, SignUp } from '@clerk/clerk-react';

AOS.init({
  duration: 500
});

function AppContent() {
  const location = useLocation();
  const isPrintPage = location.pathname.includes('/print-resume');

  return (
    <div className="min-h-screen h-screen">
      {!isPrintPage && <NavBar />}
      {
      /* 
      This is a test for sentry error tracking
      {!isPrintPage && (
        <button 
          onClick={() => {throw new Error("This is your first error!");}}
          className="fixed top-20 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg hover:bg-red-600 transition-colors z-50"
        >
          Test Sentry Error
        </button>
      )} */}
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
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/docs/:docName" element={<DynamicDocsPage />} />
        <Route path="/interview" element={<InterviewPage />} />
        <Route path="/print-resume/:id" element={<PrintPage />} />
        <Route path="/success" element={<SuccessPage />} />
        {/* <Route path="/pricing" element={<PricingPage />} /> */}
        <Route path="/cover-letter" element={<CoverLetterPage />} />
        <Route path="/metrics" element={<MetricsPage />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
      {!isPrintPage && <Footer />}
      {!isPrintPage && <ChatBot />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
