const convertToUSD = () => {};

const convertToNGN = (balance, usdRate) => {
  return Number((balance * usdRate).toFixed(2));
};

export { convertToNGN };
