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

export const swapArrayElements = (array, index1, index2) => {
  let tempEl = array[index1];
  array[index1] = array[index2]
  array[index2] = tempEl;
}
