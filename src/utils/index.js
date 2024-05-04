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

export { convertToNGN, excludeData, calculatePagination };
