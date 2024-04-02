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
