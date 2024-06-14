import Flutterwave from "flutterwave-node-v3";

const flw = new Flutterwave(
  process.env.FLW_PUBLIC_KEY,
  process.env.FLW_SECRET_KEY
);

const getPaymentLink = async (inputData) => {
  try {
    const response = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputData),
    });

    const data = await response.json();

    return data;
  } catch (err) {
    // console.log(err.code);
    // console.log(err.response.body);
    return null;
  }
};

const verifyPayment = async (transaction_id) => {
  return await flw.Transaction.verify({
    id: transaction_id,
  });
};

const getAllBanksInfo = async () => {
  try {
    const response = await fetch("https://api.flutterwave.com/v3/banks/NG", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data;
  } catch (err) {
    // console.log(err.code);
    // console.log(err.response.body);
    return null;
  }
};

export { flw, getPaymentLink, verifyPayment, getAllBanksInfo };
