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
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        userId: userId.toString(),
        amount: amount.toString()
      },
      payment_intent_data: {
        metadata: {
          userId: userId.toString(),
          amount: amount.toString()
        }
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
    const payload = Buffer.isBuffer(req.body)
      ? req.body
      : typeof req.body === "string"
        ? req.body
        : JSON.stringify(req.body);

    event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    console.error("Stripe Webhook Verification Failed:", error?.message);
    return res?.status(400).send(`Webhook Error: ${error?.message}`);
  }

  if (event?.type === 'checkout.session.completed') {
    const session = event?.data?.object;

    const userId = session?.metadata?.userId;
    const amount = parseFloat(session?.metadata?.amount);
    const transactionId = typeof session?.payment_intent === 'string'
      ? session.payment_intent
      : session?.id || `txn_${Date.now()}`;

    if (userId && !isNaN(amount)) {
      await donationDao?.createDonation({ userId, amount, transactionId, status: "success" });

      const currentTotal = await userDao?.getSingleUserTotalDonation(userId);
      const newTotal = (currentTotal || 0) + amount;

      await userDao?.updateUser({ id: userId, payload: { totalDonation: newTotal } });
    }
  }

  return res?.status(200).json({ received: true });
}

const getDonations = async (req, res) => {
  try {

    const { id: userId } = req?.user


    const page = req?.query?.page || 1
    const rowPerPage = req?.query?.rowPerPage || 10
    const skip = (page - 1) * rowPerPage
    const order = req?.query?.order || "desc"
    const orderBy = req?.query?.orderBy || "createdAt"
    const search = req?.query?.search || ""

    const donations = await donationDao?.getDonationByUserId(userId, { rowPerPage, skip, order, orderBy, page, search })
    return res?.status(200).json({ data: donations })

  } catch (error) {
    return res?.status(500).json({ message: "Internal server error" })
  }
}

module.exports = {
  createCheckoutSession,
  handleWebhook,
  getDonations
}
