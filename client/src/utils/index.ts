import { UserResource } from '@clerk/types';


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
};

export const formatDateFull = (date: Date) => {
  const inputDate = new Date(date);
  const formattedDate = inputDate.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return formattedDate;
}

export const isUserPremium = (user: UserResource | null | undefined) => {
  if (!user) {
    // User not valid
    return false;
  } else if (!user.publicMetadata.premiumUntil) {
    // User never bought premium
    return false;
  }

  console.log(new Date(user.publicMetadata.premiumUntil as string) > new Date());
  return new Date(user.publicMetadata.premiumUntil as string) > new Date()
}
