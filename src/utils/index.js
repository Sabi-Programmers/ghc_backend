const convertToUSD = () => {};

const convertToNGN = (balance, usdRate) => {
  return Number((balance * usdRate).toFixed(2));
};

const excludeData = (user, keys) => {
  return Object.fromEntries(
    Object.entries(user).filter(([key]) => !keys.includes(key))
  );
};

export { convertToNGN, excludeData };
