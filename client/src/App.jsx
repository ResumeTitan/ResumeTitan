import Footer from 'components/Footer';
import { useSelector } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import ActionPage from './pages/actionPage';
import TermsPage from './pages/termsPage';
import HomePage from './scenes/homePage';
import LandingPage from './scenes/landingPage';
import LoginPage from './pages/loginPage';
import ResumePage from './scenes/resumePage';

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
            element={isAuth ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/resume"
            element={isAuth ? <ResumePage /> : <Navigate to="/login" />}
          />
          {/* <Route path="/resume/:id/view" element={<Resume />} /> */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/test" element={<ActionPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}
