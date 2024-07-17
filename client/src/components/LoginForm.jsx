import { postLogIn, postRegister } from 'api/resume';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLogin } from 'state/authReducer';
import CloseIcon from '@mui/icons-material/Close';
import SuccessAlert from './Alert/SuccessAlert';
import ErrorAlert from './Alert/ErrorAlert';
import api from 'api/actions';

export const LoginForm = ({ onCloseLogin, registerOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(registerOpen);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform login or register logic here
    if (isRegister) {
      const data = {
        firstName,
        lastName,
        email,
        password,
      };
      await register(data);
    } else {
      const data = {
        email,
        password,
      };
      await login(data);
    }

    // Reset form fields
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
  };

  const toggleRegister = () => {
    setIsRegister(!isRegister);
  };

  const register = async (values) => {
    const response = await postRegister(values);
    if (response.status === 201) {
      // Registered user successfully
      const registerResponse = await response.json();
      console.log(`Registered new user ${registerResponse.user}`);
      if (registerResponse) {
        dispatch(
          setLogin({
            user: registerResponse.user,
            token: registerResponse.token,
          }),
        );
        onCloseLogin();
        navigate('/dashboard', { state: { newUser: true } });
        setIsRegister(false);
        setSuccessMessage('User registered successfully');
        setShowSuccess(true);
      }
    } else if (response.status === 400) {
      const error = await response.json();
      setErrorMessage(error.msg);
      setShowError(true);
    } else {
      const error = await response.json();
      setErrorMessage('Something went wrong: ', error.msg);
      setShowError(true);
    }
  };

  const login = async (values) => {
    try {
      const response = await postLogIn(values.email, values.password);
      if (response.status === 200) {
        const loggedIn = await response.json();
        console.log(
          `Attempting to log in ${JSON.stringify(loggedIn['user']['email'])}`,
        );
        if (loggedIn) {
          setShowError(false);
          dispatch(
            setLogin({
              user: loggedIn.user,
              token: loggedIn.token,
            }),
          );
          onCloseLogin();
          navigate('/dashboard', { state: { newUser: false } });
        }
      } else if (response.status === 400) {
        const error = await response.json();
        console.log('Error logging in:', error.msg);
        setErrorMessage(error.msg);
        setShowError(true);
      }
    } catch (e) {
      setErrorMessage(e.message);
      setShowError(true);
    }
  };

  /**
   * @function handleForgotPassword
   * @description Sends a reset password email to the user when button clicked
   * @throws {Error} If network response was not ok
   */
  const handleForgotPassword = async () => {
    try {
      const response = await api.post('/forgot-password', { email });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      if (response.data.success) {
        setSuccessMessage('Reset link sent to your email. Please follow instructions');
      } else {
        throw new Error(response.data.message || 'Failed to send reset email. Please try again later.');
      }
    } catch (error) {
      console.error('Failed to send reset email:', error);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="layover-container">
      <div className="form-header w-5/6 lg:w-3/4 xl:w-1/2 bg-white p-6 rounded-lg text-black">
        {showSuccess && (
          <SuccessAlert
            message={successMessage}
            onClose={() => {
              setShowSuccess(false);
            }}
          />
        )}
        {showError && (
          <ErrorAlert
            message={errorMessage}
            onClose={() => {
              setShowError(false);
            }}
          />
        )}
        <div>
          <div className="flex justify-between">
            <h2 className="flex text-2xl font-bold mb-4">
              {isRegister ? 'Register' : 'Sign In'}
            </h2>
            <div className="items-center justify-center">
            <button
              onClick={onCloseLogin}
              className="flex bg-red-500 text-white rounded-full items-center"
            >
              <CloseIcon style={{ fontSize: 24 }} />
            </button>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div>
                <div className="mb-4">
                  <label
                    className="block text-sm font-bold mb-2"
                    htmlFor="firstName"
                  >
                    {'First Name'}
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    className="form-style"
                    value={firstName}
                    onChange={handleFirstNameChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-sm font-bold mb-2"
                    htmlFor="firstName"
                  >
                    {'Last Name'}
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    className="form-style"
                    value={lastName}
                    onChange={handleLastNameChange}
                    required
                  />
                </div>
              </div>
            )}
            <div className="mb-4">
              <label
                className="block text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="form-style"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-bold mb-2"
                htmlFor="password"
              >
                {'Password'}
              </label>
              <input
                type="password"
                id="password"
                className="form-style"
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </div>

            {isRegister && (
              <div className="text-sm pb-4">
                <p>
                  {'By creating an account, you agree to our '}
                  <a href="/terms" className="text-sm text-accent-blue hover:text-blue-700">Terms of Service</a>
                  {'. We do not sell your personal data. To learn more about how we collect, use, share and protect it please read our Privacy Policy'}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <button
                id="submitLogin"
                type="submit"
                className="action-button"
              >
                {isRegister ? 'Register' : 'Sign In'}
              </button>
              <button
                type="button"
                className="secondary-action-button"
                onClick={toggleRegister}
              >
                {isRegister ? 'Sign In' : 'Register'}
              </button>
            </div>
          </form>
          <button
            type="button"
            className="text-darkest-green hover:text-main-green text-sm mb-4"
            onClick={() => setShowForgotPassword(!showForgotPassword)}
          >
            {showForgotPassword ? 'Hide' : 'Forgot Password?'}
          </button>
          {showForgotPassword && (
            <div className="flex form-style justify-between items-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="form-style w-3/5"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="button"
                className="flex action-button mx-2"
                onClick={handleForgotPassword}
              >
                Send Reset Link
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
