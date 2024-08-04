const getToken = async () => {
  // @ts-ignore
  const token = await Clerk.session.getToken();
  return token;
}

export default getToken;
