export const isAuthDisabled = () => {
  return process.env.DISABLE_AUTH === 'true';
};
