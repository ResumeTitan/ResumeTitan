import Footer from 'components/Footer';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import ActionPage from './pages/actionPage';
import TermsPage from './pages/termsPage';
import LandingPage from './scenes/landingPage';
import { Survey } from './pages/survey';
import { Dashboard } from './pages/dashboard';

export default function App() {
  return (
    <div className="min-h-screen h-screen">
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/resume" element={<ActionPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Navigate to="/" />} />
          <Route path="/survey" element={<Survey />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}
