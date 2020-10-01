

const request = require("request");

const paystack = (request) => {

    const MySecretKey =
      process.env.PAYSTACK_SECRET;
  //sk_test_xxxx to be replaced by your own secret key
  const initializePayment = (form, mycallback) => {
    const option = {
      url: "https://api.paystack.co/transaction/initialize",
      headers: {
        Authorization: MySecretKey,
        "content-type": "application/json",
        "cache-control": "no-cache",
      },
      form,
    };
    const callback = (error, response, body) => {
      return mycallback(error, body);
    };
    request.post(option, callback);
  };
  const verifyPayment = (ref, mycallback) => {
    const option = {
      url:
        "https://api.paystack.co/transaction/verify/" + encodeURIComponent(ref),
      headers: {
        Authorization: MySecretKey,
        "content-type": "application/json",
        "cache-control": "no-cache",
      },
    };
    const callback = (error, response, body) => {
      return mycallback(error, body);
    };
    request(option, callback);
  };
  return { initializePayment, verifyPayment };
};
module.exports = paystack;
