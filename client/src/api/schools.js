const API_URL = process.env.REACT_APP_API_URL;

/* Get all schools */
export const getSchools = async (token, userId) => {
  const response = await fetch(`${API_URL}/schools`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    user: { id: userId },
  });

  return response;
}

/* Create a school */
export const createSchool = async (token, school, userId) => {
  const response = await fetch(`${API_URL}/schools`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(school),
    user: { id: userId },
  });

  return response;
}

/* Update a school */
export const updateSchool = async (token, id, school) => {
  const response = await fetch(`${API_URL}/schools/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(school),
  });

  return response;
}

/* Delete a school */
export const deleteSchool = async (token, id) => {
  const response = await fetch(`${API_URL}/schools/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
  });

  return response;
}
