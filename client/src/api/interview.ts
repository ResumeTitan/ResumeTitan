const API_URL = process.env.REACT_APP_API_URL;

export const createInterview = async (
  token: string, 
  jobTitle: string, 
  jobDescription: string
) => {
  const response = await fetch(`${API_URL}/interview`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({jobTitle, jobDescription}),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
}

/**
 * 
 * @param token User token for authentication
 * @returns interviews for the user
 */
export const getInterviews = async (token: string) => {
  const response = await fetch(`${API_URL}/interview`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
}

/**
 * 
 * @param token User token for authentication
 * @param id The interview id to delete
 * @returns 
 */
export const deleteInterview = async (token: string, id: string) => {
  const response = await fetch(`${API_URL}/interview/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
}

export const getInterview = async (token: string, id: string) => {
  const response = await fetch(`${API_URL}/interview/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
}
