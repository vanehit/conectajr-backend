import paypal from "@paypal/checkout-server-sdk";

const environment = new paypal.core.LiveEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_SECRET
);

// En desarrollo usar SandboxEnvironment
// const environment = new paypal.core.SandboxEnvironment(...);

const client = new paypal.core.PayPalHttpClient(environment);

export default client;
