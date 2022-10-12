// To verify transactions you need to set up a webhook URL for coinbase commerce to send an HTTP post request to that route when a user makes a payment
// Set this up in you Coinbase Commerce account => Settings - Notifications - Add an endpoint and add your route (example https://your-domain/api/verify)
// Don' forget to get your Shared secret and add it to the .env file

import { Client, Webhook } from "coinbase-commerce-node";

Client.init(process.env.COINBASE_API);

export default async function coinVerifyRoute(req, res) {
  try {
    // Verify that request is coming from Coinbase Commerce and not a malicious person
    const rawBody = JSON.stringify(req.body);
    const signature = String(req.headers["x-cc-webhook-signature"]);
    const webhookSecret = String(process.env.COINBASE_SECRET);
    // If the message is not from Coinbase this will thrown an error
    const event = Webhook.verifyEventBody(rawBody, signature, webhookSecret);

    console.log(event);

    if (event.type === "charge:pending") {
      // user paid, but transaction not confirmed on blockchain
      console.log("pending");
    }

    if (event.type === "charge:confirmed") {
      // all good, charge confirmed
      // You can use the metadata about the customer and products to send the product to the customer after the charge is confirmed
      console.log("confirmed");
    }

    if (event.type === "charge:failed") {
      // charge failed or expired
      console.log("failed");
    }
  } catch (e) {
    res.status(500).send("error");
  }

  res.send(`success`);
}
