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
const getAccName = async (accessToken, data) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("X-Auth-Signature", BANK_AUTH);
    myHeaders.append("Authorization", "Bearer " + accessToken);
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(data),
    };

    console.log(requestOptions);
    const res = await fetch(
      "https://api.vendpocket.com/v1/bank/accountname",
      requestOptions
    );
    const resData = await res.json();
    return resData;
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
};
const createFlippedAcc = async (accessToken, data) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("X-Auth-Signature", BANK_AUTH);
    myHeaders.append("Authorization", "Bearer " + accessToken);
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(data),
    };

    console.log(requestOptions);
    const res = await fetch(
      "https://api.vendpocket.com/v2/virtual/create_flipped",
      requestOptions
    );
    const resData = await res.json();
    return resData;
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
};

const getInfo = async (accessToken) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("X-Auth-Signature", BANK_AUTH);
    myHeaders.append("Authorization", "Bearer " + accessToken);

    let raw = "";

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };
    const res = await fetch(
      "https://api.vendpocket.com/v1/account_stats",
      requestOptions
    );
    const resData = await res.json();
    return resData;
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
};
const getBankList = async (accessToken) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("X-Auth-Signature", BANK_AUTH);
    myHeaders.append("Authorization", "Bearer " + accessToken);

    let raw = "";

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };
    const res = await fetch(
      "https://api.vendpocket.com/v1/banklist",
      requestOptions
    );
    const resData = await res.json();
    return resData;
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
};
let bankSystem = {};
export default bankSystem = {
  init,
  createFlippedAcc,
  getInfo,
  getBankList,
  getAccName,
};

/**
 * var myHeaders = new Headers();
myHeaders.append("X-Auth-Signature", "24b54be2f61ef");
myHeaders.append("Authorization", "Bearer 10060275520bdb21e1b");

var raw = "";

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("[BASE_URL]/v1/account_stats", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
 */

/**
 * var myHeaders = new Headers();
myHeaders.append("X-Auth-Signature", "34d2c820a315b");
myHeaders.append("Authorization", "Bearer 243b49109d735");

var raw = "{\r\n\"FirstName\": \"Ola\",\r\n\"LastName\": \"Lakean\",\r\n\"OtherName\": \"Salam\",\r\n\"PhoneNumber\": \"08161700000\",\r\n\"Gender\": \"Male\",\r\n\"Email\": \"olam@gmail.com\",\r\n\"CustomerAccountNumber\": \"1030757234\",\r\n\"CustomerBankCode\": \"058\"\r\n}";

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://api.vendpocket.com/v2/virtual/create_flipped", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
 */
