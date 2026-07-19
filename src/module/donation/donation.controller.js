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
    console.error("Session Error:", error); 
    return res.status(500).json({ message: "Internal server error" });
  }
}

const getUserDonations = async (req, res) => {
  try {
    // req.user se user ki id aur role dono nikalenge (jaise aapne user.controller me kiya tha)
    const { id: userId, role: userRole } = req?.user;
    
    let donationList = [];
    let totalDonationAmount = 0;

    if (userRole === "admin") {
      // 👑 ADMIN FLOW: Parallelly platform ke saare donations aur global total fetch karenge
      const [allDonations, platformTotal] = await Promise.all([
        donationDao.getAllDonations(),
        userDao.getTotalPlatformDonation() // Yeh aapke user.dao.js me pehle se bana hua hai
      ]);
      
      donationList = allDonations;
      totalDonationAmount = platformTotal;
    } else {
      // 👤 USER FLOW: Parallelly sirf usi user ka history aur uska personal total fetch karenge
      const [userDonations, userTotal] = await Promise.all([
        donationDao.getDonationByUserId(userId),
        userDao.getSingleUserTotalDonation(userId) // Yeh bhi user.dao.js me pehle se hai
      ]);
      
      donationList = userDonations;
      totalDonationAmount = userTotal;
    }

    return res?.status(200).json({ 
      data: { 
        donation: donationList, 
        totalDonation: totalDonationAmount,
        role: userRole // Frontend ko batane ke liye ki ye kis role ka data hai
      }, 
      message: `${userRole === 'admin' ? 'All platform' : 'User'} donations fetched successfully.` 
    });

  } catch (error) {
    console.error("Get Donations Error:", error);
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

module.exports = {
  createCheckoutSession,
  getUserDonations,
  handleWebhook
}
