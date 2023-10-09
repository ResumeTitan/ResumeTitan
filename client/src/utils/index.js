export const getToAndFromDates = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return `${start.getFullYear()} - ${end.getFullYear()}`;
}

export function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}

export const formatDate = (date) => {
  const inputDate = new Date(date);

  // Options for formatting the date
  const options = { year: 'numeric', month: 'long' };

  // Format the date to "Month, Year" format
  const formattedDate = inputDate.toLocaleString('en-US', options);
  return formattedDate;
};

// Base width of the resume is 1056px
const RESUME_BASE_WIDTH = 1056;

export const getScaleForResumeViewer = (screenWidth) => {
  const scale = screenWidth / RESUME_BASE_WIDTH;
  return scale;
}

