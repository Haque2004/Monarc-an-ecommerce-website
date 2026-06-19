const https = require("https");
const querystring = require("querystring");
const Order = require("../models/Order");
const Product = require("../models/Product");

const createOrder = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    customerName,
    customerEmail,
    customerPhone,
  } = req.body;

  if (!orderItems || !orderItems.length) {
    return res.status(400).json({
      success: false,
      message: "No order items provided",
    });
  }

  const items = [];
  let totalPrice = 0;

  for (const item of orderItems) {
    const productId = item.product || item.id || item._id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found: ${item.name || productId}`,
      });
    }

    if (item.qty <= 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid quantity for ${product.name}`,
      });
    }

    if (item.qty > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
      });
    }

    const orderItem = {
      name: product.name,
      qty: item.qty,
      image: item.image || product.images[0]?.url || "",
      price: product.price,
      product: product._id,
    };

    items.push(orderItem);
    totalPrice += product.price * item.qty;
  }

  const order = await Order.create({
    user: req.user?._id,
    customerName: customerName || "Guest",
    customerEmail: customerEmail || "guest@example.com",
    customerPhone: customerPhone || "",
    orderItems: items,
    shippingAddress,
    paymentMethod: paymentMethod || "Cash On Delivery",
    totalPrice,
  });

  for (const item of items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.qty },
    });
  }

  res.status(201).json(order);
};

const createSslcommerzSession = async (req, res) => {
  const {
    orderItems,
    shippingAddress = {},
    customerName,
    customerEmail,
    customerPhone,
  } = req.body;

  if (!orderItems || !orderItems.length) {
    return res.status(400).json({
      success: false,
      message: "No order items provided",
    });
  }

  const items = [];
  let totalPrice = 0;

  for (const item of orderItems) {
    const productId = item.product || item.id || item._id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found: ${item.name || productId}`,
      });
    }

    if (item.qty <= 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid quantity for ${product.name}`,
      });
    }

    if (item.qty > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
      });
    }

    const orderItem = {
      name: product.name,
      qty: item.qty,
      image: item.image || product.images[0]?.url || "",
      price: product.price,
      product: product._id,
    };

    items.push(orderItem);
    totalPrice += product.price * item.qty;
  }

  const tranId = `monarc_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  const storeId = process.env.SSL_COMMERZ_STORE_ID;
  const storePassword = process.env.SSL_COMMERZ_STORE_PASSWORD;
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const serverUrl = process.env.SERVER_URL || "http://localhost:5000";

  if (!storeId || !storePassword) {
    return res.status(500).json({
      success: false,
      message: "SSLCommerz credentials are not configured",
    });
  }

  const payload = {
    store_id: storeId,
    store_passwd: storePassword,
    total_amount: totalPrice.toFixed(2),
    currency: "BDT",
    tran_id: tranId,
    success_url: `${clientUrl}/payment-success?tran_id=${tranId}`,
    fail_url: `${clientUrl}/payment-fail?tran_id=${tranId}`,
    cancel_url: `${clientUrl}/payment-fail?tran_id=${tranId}`,
    ipn_url: `${serverUrl}/api/orders/sslcommerz/ipn`,
    product_name: "MONARC Order",
    product_category: "Fashion",
    product_profile: "general",
    cus_name: customerName || "Guest",
    cus_email: customerEmail || "guest@example.com",
    cus_add1: shippingAddress.address || "Not provided",
    cus_city: shippingAddress.city || "Dhaka",
    cus_postcode: shippingAddress.postalCode || "0000",
    cus_country: shippingAddress.country || "Bangladesh",
    cus_phone: customerPhone || "00000000000",
    shipping_method: "NO",
    value_a: tranId,
  };

  const postData = querystring.stringify(payload);

  const requestOptions = {
    hostname: "sandbox.sslcommerz.com",
    path: "/gwprocess/v4/api.php",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(postData),
    },
  };

  const sslResponse = await new Promise((resolve, reject) => {
    const request = https.request(requestOptions, (response) => {
      let body = "";

      response.on("data", (chunk) => {
        body += chunk;
      });

      response.on("end", () => {
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(error);
        }
      });
    });

    request.on("error", (error) => reject(error));
    request.write(postData);
    request.end();
  });

  if (!sslResponse || !sslResponse.GatewayPageURL) {
    return res.status(500).json({
      success: false,
      message:
        sslResponse?.failedreason ||
        "Unable to initialize SSLCommerz payment",
    });
  }

  const order = await Order.create({
    user: req.user?._id,
    customerName: customerName || "Guest",
    customerEmail: customerEmail || "guest@example.com",
    customerPhone: customerPhone || "",
    orderItems: items,
    shippingAddress,
    paymentMethod: "SSLCommerz",
    totalPrice,
    sslCommerzTranId: tranId,
  });

  for (const item of items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.qty },
    });
  }

  res.json({
    success: true,
    url: sslResponse.GatewayPageURL,
    orderId: order._id,
  });
};

const createBkashSession = async (req, res) => {
  const {
    orderItems,
    shippingAddress = {},
    customerName,
    customerEmail,
    customerPhone,
  } = req.body;

  if (!orderItems || !orderItems.length) {
    return res.status(400).json({
      success: false,
      message: "No order items provided",
    });
  }

  const items = [];
  let totalPrice = 0;

  for (const item of orderItems) {
    const productId = item.product || item.id || item._id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found: ${item.name || productId}`,
      });
    }

    if (item.qty <= 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid quantity for ${product.name}`,
      });
    }

    if (item.qty > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
      });
    }

    const orderItem = {
      name: product.name,
      qty: item.qty,
      image: item.image || product.images[0]?.url || "",
      price: product.price,
      product: product._id,
    };

    items.push(orderItem);
    totalPrice += product.price * item.qty;
  }

  const bkashNumber = process.env.BKASH_MERCHANT_NUMBER || "01700000000";
  const bkashReference = `BKASH-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  const order = await Order.create({
    user: req.user?._id,
    customerName: customerName || "Guest",
    customerEmail: customerEmail || "guest@example.com",
    customerPhone: customerPhone || "",
    orderItems: items,
    shippingAddress,
    paymentMethod: "bKash",
    totalPrice,
    sslCommerzTranId: "",
  });

  for (const item of items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.qty },
    });
  }

  return res.json({
    success: true,
    orderId: order._id,
    instructions: {
      bkashNumber,
      amount: totalPrice.toFixed(2),
      reference: bkashReference,
      note: "Send payment via bKash to the merchant number and keep the transaction ID for confirmation.",
    },
  });
};

const handleSslcommerzIpn = async (req, res) => {
  const { status, tran_id } = req.body;

  if (!tran_id) {
    return res.status(400).send("Invalid IPN payload");
  }

  const order = await Order.findOne({ sslCommerzTranId: tran_id });

  if (!order) {
    return res.status(404).send("Order not found");
  }

  if (status === "VALID" || status === "VALIDATED") {
    order.isPaid = true;
    order.paidAt = new Date();
    await order.save();
    return res.status(200).send("IPN received");
  }

  if (status === "FAILED") {
    order.isPaid = false;
    await order.save();
    return res.status(200).send("IPN received");
  }

  res.status(200).send("IPN received");
};

const getMyOrders = async (req, res) => {
  const orders = await Order.find({
    user: req.user._id,
  });

  res.json(orders);
};

const getOrderById = async (req, res) => {
  const order = await Order.findById(
    req.params.id
  ).populate("user", "name email");

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  res.json(order);
};

module.exports = {
  createOrder,
  createSslcommerzSession,
  createBkashSession,
  handleSslcommerzIpn,
  getMyOrders,
  getOrderById,
};