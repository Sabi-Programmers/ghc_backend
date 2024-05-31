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
    console.log(err.code);
    console.log(err.response.body);
    return null;
  }
};

const verifyPayment = async () => {
  // e.g
  // app.get('/payment-callback', async (req, res) => {

  // );

  if (req.query.status === "successful") {
    // const transactionDetails = await Transaction.find({
    //   ref: req.query.tx_ref,
    // });
    const response = await flw.Transaction.verify({
      id: req.query.transaction_id,
    });
    if (
      response.data.status === "successful" &&
      //   response.data.amount === transactionDetails.amount &&
      response.data.currency === "NGN"
    ) {
      // Success! Confirm the customer's payment
    } else {
      // Inform the customer their payment was unsuccessful
    }
  }
};

export { flw, getPaymentLink, verifyPayment };
