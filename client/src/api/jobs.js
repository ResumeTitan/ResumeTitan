const API_URL = process.env.REACT_APP_API_URL;

/* Get all jobs */
export const getJobs = async (token, userId) => {
  const response = await fetch(`${API_URL}/resume?userId=${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: { id: userId },
  });

  return response;
}

/* Create a job */
export const createJob = async (token, job) => {
  const response = await fetch(`${API_URL}/jobs/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(job),
  });

  return response;
}

/* Update a job */
export const updateJob = async (token, id, job) => {
  const response = await fetch(`${API_URL}/jobs/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(job),
  });

  return response;
}

/* Delete a job */
export const deleteJob = async (token, id) => {
  const response = await fetch(`${API_URL}/jobs/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
  });

  return response;
}
