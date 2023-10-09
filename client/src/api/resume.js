const API_URL = process.env.REACT_APP_API_URL;

export const createResume = async (token, resume) => {
  const response = await fetch(`${API_URL}/resume/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(resume),
  });

  return response.json();
}

export const getResume = async (token, userId) => {
  const response = await fetch(`${API_URL}/resume?userId=${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  return response.json();
}

export const postLogIn = async (email, password) => {
  console.log(`Attempting to log in ${JSON.stringify(email)}`);
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({email, password}),
  });
  return response;
}

export const postRegister = async (values) => {
  console.log("Registering user", values);
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  return response;
}
