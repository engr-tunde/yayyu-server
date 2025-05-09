const Category = require("../../models/general/Category");
const Discount = require("../../models/general/Discount");
const Product = require("../../models/general/Product");
const Review = require("../../models/general/Review");
const Shipping = require("../../models/general/Shipping");
const Order = require("../../models/user/Order");
const User = require("../../models/user/User");
const { sendSuccess, sendError } = require("../../utils/helpers");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const fetchAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return sendSuccess(res, "Successfully fetched products", products);
    // return sendError(res, "Unable to fetch all products");
  } catch (err) {
    console.log(err);
    return sendError(res, "Unable to fetch all products");
  }
};

const fetchSingleProductByID = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    return sendSuccess(res, "Successfully fetched the product", product);
  } catch (err) {
    console.log(err);
    return sendError(res, "Unable to fetch the product data");
  }
};

const fetchSingleProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ item_slug: req.params.item_slug });
    return sendSuccess(res, "Successfully fetched the product", product);
  } catch (err) {
    console.log(err);
    return sendError(res, "Unable to fetch the product data");
  }
};

const fetchAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return sendSuccess(
      res,
      "Successfully fetched products categories",
      categories
    );
  } catch (err) {
    console.log(err);
    return sendError(res, "Unable to fetch product categories");
  }
};

const fetchReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    return sendSuccess(res, "Successfully fetched reviews", reviews);
  } catch (err) {
    console.log(err);
    return sendError(res, "Unable to fetch all reviews");
  }
};
const fetchProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ owner: req.params.owner });
    return sendSuccess(res, "Successfully fetched reviews", reviews);
  } catch (err) {
    console.log(err);
    return sendError(res, "Unable to fetch all reviews");
  }
};
const fetchAllShippingData = async (req, res) => {
  try {
    const shipping = await Shipping.find();
    return sendSuccess(res, "Successfully fetched shipping", shipping);
  } catch (err) {
    console.log(err);
    return sendError(res, "Unable to fetch shipping data");
  }
};
const fetchGeneralDiscount = async (req, res) => {
  try {
    const discount = await Discount.find();
    return sendSuccess(res, "Successfully fetched discount data", discount[0]);
  } catch (err) {
    console.log(err);
    return sendError(res, "Unable to fetch discount data");
  }
};

const makeOrder = async (req, res, next) => {
  const { email, first_name, last_name, phone, items } = req.body;
  const item1 = items[0];
  let order_title;
  let new_user = true;
  if (item1.color != "") {
    if (item1.size != "") {
      order_title =
        item1.item_name + " " + item1.color + " " + item1.size + " and others";
    } else {
      order_title = item1.item_name + " " + item1.color + " and others";
    }
  } else {
    if (item1.size != "") {
      order_title = item1.item_name + " " + item1.size + " and others";
    } else {
      order_title = item1.item_name + " and others";
    }
  }
  req.body.img = item1.img;
  req.body.order_title = order_title;

  // check if user exists
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      req.body.owner = userExists._id;
      new_user = false;
    } else {
      const password = first_name.toLowerCase();
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
      const newUser = new User({
        first_name,
        last_name,
        email,
        phone,
        password: hashedPassword,
      });
      await newUser.save();
      req.body.owner = newUser._id;
    }
    const newOrder = new Order(req.body);
    await newOrder.save();
    req.body = { newOrder, new_user };
    next();
  } catch (err) {
    console.log(err);
    return sendError(res, "Unable to complete booking. Reach out to support");
  }
};

module.exports = {
  fetchAllProducts,
  fetchSingleProductByID,
  fetchSingleProductBySlug,
  fetchAllCategories,
  fetchReviews,
  fetchProductReviews,
  fetchAllShippingData,
  fetchGeneralDiscount,

  makeOrder,
};
