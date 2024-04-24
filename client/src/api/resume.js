const API_URL = process.env.REACT_APP_API_URL;

export const createResume = async (token, resume, jobDescription) => {
  const response = await fetch(`${API_URL}/resume/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({resume, jobDescription}),
  });

  const data = await response.json();
  return data;
}

export const updateResume = async (token, resume) => {
  const response = await fetch(`${API_URL}/resume/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(resume),
  });

  return response.json();
}

export const getResumes = async (token, userId) => {
  console.log(`Getting resumes for user ${userId}`);
  const response = await fetch(`${API_URL}/resume/user?userId=${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  return response.json();
}

export const getResume = async (token, resumeId) => {
  const response = await fetch(`${API_URL}/resume?id=${resumeId}`, {
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

export const deleteResume = async (token, resumeId) => {
  const response = await fetch(`${API_URL}/resume/delete?id=${resumeId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  return response.json();
}

export const saveResumeAsPdf = async (token, resumeHtml) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(resumeHtml),
  });

  return response;
}
