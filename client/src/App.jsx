import Footer from 'components/Footer';
import { useSelector } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import ActionPage from './pages/actionPage';
import TermsPage from './pages/termsPage';
import LandingPage from './scenes/landingPage';
import ResumePage from './scenes/resumePage';
// import { Dashboard } from './pages/dashboard';

export default function App() {
  const isAuth = Boolean(useSelector((state) => state.token));
  return (
    <div className="min-h-screen bg-white">
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/home"
            element={isAuth ? <ActionPage /> : <Navigate to="/" />}
          />
          <Route
            path="/resume"
            element={isAuth ? <ResumePage /> : <Navigate to="/" />}
          />
          <Route path="/terms" element={<TermsPage />} />
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route path="/login" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}
