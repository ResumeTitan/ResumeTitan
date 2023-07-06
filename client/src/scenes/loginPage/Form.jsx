import React, { useState } from "react";
import { setLogin } from "state";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://incorrect_url';

const Form = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

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
      console.log('Register:');
      console.log('Email:', email);
      console.log('Password:', password);
    } else {
      const data = {
        email,
        password,
      }
      await login(data);
    }

    // Reset form fields
    setEmail('');
    setPassword('');
  };

  const toggleRegister = () => {
    setIsRegister(!isRegister);
  };

  async function postRegister(values){
    // this allows us to send form info with image
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }

    const savedUserResponse = await fetch(
      `${API_URL}/auth/register`,
      {
        method: "POST",
        body: formData,
      }
    );
    return savedUserResponse.json();
  }

  const register = async (values, onSubmitProps) => {
    const savedUser = await postRegister(values);

    if (savedUser) {
      setIsRegister(false);
    }
  };
  
  async function postLogIn(data){
    console.log(`Attempting to log in ${JSON.stringify(data["email"])}`);
    const loggedInResponse = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return loggedInResponse.json();
  }

  const login = async (values) => {
    const loggedIn = await postLogIn(values);
    console.log(`Attempting to log in ${JSON.stringify(loggedIn["user"]["email"])}`);
    if (loggedIn) {
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      navigate("/", { user: loggedIn.user });
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isRegister) {
      await register(values, onSubmitProps);
    } else {
      await login(values, onSubmitProps);
    }
  };


  // -TODO- do when google oauth is setup
  // const googleLogin = useGoogleLogin({
  //   onSuccess: (codeResponse) => {getGoogleInfo(codeResponse)},
  //   onError: (error) => console.log('Login Failed:', error)
  // });
  // const getGoogleInfo = async (user) => {
  //   const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,{mode: 'cors'}, {
  //     method: "GET"
  //   });
  //   const data = await response.json();
  //   const userData = {
  //     email: data.email,
  //     password: data.id,
  //     firstName: data.given_name,
  //     lastName: data.family_name,
  //     location: "",
  //     occupation: ""
  //   };

  //   const loggedIn = await postLogIn(userData);
  //   console.log(`Attempting to log in ${JSON.stringify(loggedIn["user"]["email"])}`);
  //   if (loggedIn.ok) {
  //     dispatch(
  //       setLogin({
  //         user: loggedIn.user,
  //         token: loggedIn.token,
  //       })
  //     );
  //     navigate("/home");
  //   }
  //   else{
  //     //REGISTER
  //     const savedUser = await postRegister(userData);  
  //     if (savedUser) {
  //       const loggedIn = await postLogIn(userData);
  //       dispatch(
  //         setLogin({
  //           user: loggedIn.user,
  //           token: loggedIn.token,
  //         })
  //       );
  //       navigate("/home");
  //     }
  //   }
  // };

  return (
    <div>
    <h2 className="text-2xl font-bold mb-4">
    {isRegister ? 'Register' : 'Login'}
  </h2>
  <form onSubmit={handleSubmit}>
    {isRegister && (
      <div>
        <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="firstName"
        >
          First Name
        </label>
        <input
          type="text"
          id="firstName"
          className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={firstName}
          onChange={handleFirstNameChange}
          required
        />
      </div>
        <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="firstName"
        >
          Last Name
        </label>
        <input
          type="text"
          id="lastName"
          className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={lastName}
          onChange={handleLastNameChange}
          required
        />
      </div>
    </div>
    )}
    <div className="mb-4">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor="email"
      >
        Email
      </label>
      <input
        type="email"
        id="email"
        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        value={email}
        onChange={handleEmailChange}
        required
      />
    </div>
    <div className="mb-4">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor="password"
      >
        Password
      </label>
      <input
        type="password"
        id="password"
        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        value={password}
        onChange={handlePasswordChange}
        required
      />
    </div>
    <div className="flex items-center justify-between mb-4">
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        {isRegister ? 'Register' : 'Sign In'}
      </button>
      <button
        type="button"
        className="text-blue-500 hover:text-blue-700 text-sm"
        onClick={toggleRegister}
      >
        {isRegister ? 'Sign In' : 'Register'}
      </button>
    </div>
  </form>
  </div>
  );
}

export default Form;