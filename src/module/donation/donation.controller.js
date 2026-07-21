const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const donationDao = require("./donation.dao");
const userDao = require("../user/user.dao");

const createCheckoutSession = async (req, res) => {
  try {
    const { amount, currency } = req?.body;
    const { id: userId } = req?.user;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid donation amount." });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency || "usd",
            product_data: {
              name: "Project Donation",
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        userId: userId.toString(),
        amount: amount.toString()
      },
      success_url: `${process.env.CLIENT_URL}/dashboard?success=true`,
      cancel_url: `${process.env.CLIENT_URL}/dashboard?canceled=true`,
    });

    return res?.status(200).json({ url: session?.url, message: "Checkout session created successfully." });

  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req?.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return res?.status(400).send(`Webhook Error: ${error?.message}`);
  }

  if (event?.type === 'checkout.session.completed') {
    const session = event?.data?.object;

    const userId = session?.metadata?.userId;
    const amount = parseFloat(session?.metadata?.amount);
    const transactionId = session?.payment_intent;

    await donationDao?.createDonation({ userId, amount, transactionId, status: "success" });

    const currentTotal = await userDao?.getSingleUserTotalDonation(userId);
    const newTotal = (currentTotal || 0) + amount;

    await userDao?.updateUser({ id: userId, payload: { totalDonation: newTotal } });
  }

  return res?.status(200).json({ received: true });
}

const getDonations = async (req, res) => {
  try {

    const { id: userId } = req?.user
    const result = await donationDao?.getDonations(userId)
    return res?.status(200).json({ data: result })

  } catch (error) {
    return res?.status(500).json({ message: "Internal server error" })
  }
}

module.exports = {
  createCheckoutSession,
  handleWebhook,
  getDonations
}
