import { useNavigate } from 'react-router-dom';
import HeroSection from './heroSection';

function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="bg-white">
      <HeroSection />
      <div class="flex justify-center">
        <div class="max-w-sm rounded overflow-hidden shadow-lg m-4">
          <div class="px-6 py-4">
            <div class="font-bold text-xl mb-2">
              Spend time on your job search, not your resume
            </div>
            <p class="text-gray-700 text-base">
              Are you tired of spending hours of time perfecting how your resume
              should look instead of finding your dream job? Let ResumeTitan
              take your resume to the next level with the use of artificial
              intelligence to fill in the blanks.
            </p>
          </div>
        </div>

        <div class="max-w-sm rounded overflow-hidden shadow-lg m-4">
          <div class="px-6 py-4">
            <div class="font-bold text-xl mb-2">
              Next-gen features are your finger tips
            </div>
            <p class="text-gray-700 text-base">
              ResumeTitan allows for you to not only have professional-grade
              resumes generated in minutes, but also allows you to make your own
              changes to make your resume how YOU want it to look!
            </p>
          </div>
        </div>

        <div class="max-w-sm overflow-hidden m-4 flex items-center justify-center">
          <button
            href="/login"
            className="text-lg px-6 py-4 font-bold leading-none border border-4 rounded text-white bg-teal-800 hover:border-transparent hover:bg-white hover:text-teal-800 items-center transition duration-300 ease-in-out"
            onClick={() => navigate('/login')}
          >
            Register now!
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
