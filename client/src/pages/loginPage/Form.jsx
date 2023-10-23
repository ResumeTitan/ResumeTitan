import { postLogIn, postRegister } from 'api/resume';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLogin } from 'state';
import SuccessAlert from '../../components/Alert/SuccessAlert';
import ErrorAlert from '../../components/Alert/ErrorAlert';

const Form = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [newUserRegistered, setNewUserRegistered] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
        navigate('/home', { state: { newUser: true } });
        setIsRegister(false);
        setNewUserRegistered(true);
      }
    } else if (response.status === 400) {
      const error = await response.json();
      setErrorMessage(error.msg);
      setLoginFailed(true);
    } else {
      const error = await response.json();
      setErrorMessage('Something went wrong: ', error.msg);
      setLoginFailed(true);
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
          setLoginFailed(false);
          dispatch(
            setLogin({
              user: loggedIn.user,
              token: loggedIn.token,
            }),
          );
          navigate('/home', { state: { newUser: false } });
        }
      } else if (response.status === 400) {
        const error = await response.json();
        setErrorMessage(error.msg);
        setLoginFailed(true);
      }
    } catch (e) {
      setErrorMessage(e.message);
      setLoginFailed(true);
    }
  };

  return (
    <div>
      {newUserRegistered && (
        <SuccessAlert
          message={`Success! Registered new user, ${firstName} ${lastName}`}
          onClose={() => {
            setNewUserRegistered(false);
          }}
        />
      )}
      {loginFailed && (
        <ErrorAlert
          message={errorMessage}
          onClose={() => {
            setLoginFailed(false);
          }}
        />
      )}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-200">
          {isRegister ? 'Register' : 'Login'}
        </h2>
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div>
              <div className="mb-4">
                <label
                  className="block text-gray-200 text-sm font-bold mb-2"
                  htmlFor="firstName"
                >
                  {'First Name'}
                </label>
                <input
                  type="text"
                  id="firstName"
                  className="appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                  value={firstName}
                  onChange={handleFirstNameChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-300 text-sm font-bold mb-2"
                  htmlFor="firstName"
                >
                  {'Last Name'}
                </label>
                <input
                  type="text"
                  id="lastName"
                  className="appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                  value={lastName}
                  onChange={handleLastNameChange}
                  required
                />
              </div>
            </div>
          )}
          <div className="mb-4">
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="password"
            >
              {'Password'}
            </label>
            <input
              type="password"
              id="password"
              className="appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="flex items-center justify-between mb-4">
            <button
              type="submit"
              className="bg-accent-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {isRegister ? 'Register' : 'Sign In'}
            </button>
            <button
              type="button"
              className="text-accent-blue hover:text-blue-700 text-sm"
              onClick={toggleRegister}
            >
              {isRegister ? 'Sign In' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
