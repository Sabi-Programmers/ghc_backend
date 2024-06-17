const { BANK_TOKEN, BANK_AUTH } = process.env;

const init = async () => {
  try {
    const formdata = new FormData();
    formdata.append("auth", BANK_AUTH);
    formdata.append("token", BANK_TOKEN);

    const requestOptions = {
      method: "POST",
      body: formdata,
      //   redirect: "follow",
    };
    const res = await fetch(
      "https://api.vendpocket.com/v2/init",
      requestOptions
    );
    const resData = await res.json();
    return resData;
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
};

export default bankSystem = { init };
