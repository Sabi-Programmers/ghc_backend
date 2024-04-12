function generateRandomNumber() {
  const min = 1000000000; // Minimum 10-digit number
  const max = 9999999999; // Maximum 10-digit number
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generateVitualBankDetails = async (name) => {
  try {
    return new Promise((resolve, reject) => {
      const randomAccNumber = generateRandomNumber();
      const bankdetails = {
        accountName: name,
        accountNumber: randomAccNumber,
        virtualBankName: "GHC Demo Bank",
      };
      resolve(bankdetails);
    });
  } catch (error) {
    return null;
  }
};

export { generateVitualBankDetails };
