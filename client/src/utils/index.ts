export function isObjectEmpty(obj: object) {
  return Object.keys(obj).length === 0;
}

export const formatDate = (date: string) => {
  const inputDate = new Date(date);

  // Format the date to "Month, Year" format
  const formattedDate = inputDate.toLocaleString('en-US', { year: 'numeric', month: 'long' });
  return formattedDate;
};

export const swapArrayElements = (array: any[], index1: number, index2: number) => {
  let tempEl = array[index1];
  array[index1] = array[index2]
  array[index2] = tempEl;
}
