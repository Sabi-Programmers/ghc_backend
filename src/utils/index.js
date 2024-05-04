const convertToUSD = () => {};

const convertToNGN = (balance, usdRate) => {
  return Number((balance * usdRate).toFixed(2));
};

const excludeData = (user, keys) => {
  return Object.fromEntries(
    Object.entries(user).filter(([key]) => !keys.includes(key))
  );
};

const calculatePagination = (totalItems, currentPage, pageSize) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;
  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  return {
    totalPages,
    nextPage,
    prevPage,
    currentPage,
  };
};

const generateRandomString = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export { convertToNGN, excludeData, calculatePagination, generateRandomString };
