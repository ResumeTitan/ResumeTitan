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

  console.log("getResume response", response);

  return response.json();
}