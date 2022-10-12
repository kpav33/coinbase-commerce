import { Client, resources } from "coinbase-commerce-node";
import { products } from "../../data";

// Initiate the Coinbase commerce client
Client.init(String(process.env.COINBASE_API));
const { Charge } = resources;

const coinInitRoute = async (req, res) => {
  const { id } = req.body;

  // Use the product id from the request body to find the correct product
  const product = products.find((product) => product.id === id);

  // Create a charge
  try {
    const chargeData = {
      name: product.name,
      description: product.description,
      // Set a fixed price that user must pay, "no_price" would allow user to pay any amount
      pricing_type: "fixed_price",
      local_price: {
        amount: product.price,
        currency: product.currency,
      },
      // Used to send additional data to Coinbase commerce to identify the user and the product they paid for
      metadata: {
        id: product.id,
        userID: 1,
      },
    };

    // Creates a charge by sending a request to Coinbase commerce
    const charge = await Charge.create(chargeData);
    // Once "charge" is successful it sends the charged object to the client
    res.send(charge);
  } catch (e) {
    res.status(500).send({ error: e });
  }
};

export default coinInitRoute;
