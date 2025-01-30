const express = require("express");
const {
  fetchAllProducts,
  fetchSingleProduct,
  fetchAllCategories,
  fetchSingleProductByID,
  fetchSingleProductBySlug,
  fetchReviews,
  fetchProductReviews,
  makeOrder,
  fetchAllShippingData,
  fetchGeneralDiscount,
} = require("../../controllers/general/general-controllers");
const { orderSuccessfulEmail } = require("../../services/emailServices");
const router = express.Router();

router.get("/all-products", fetchAllProducts);
router.get("/single-product/:id", fetchSingleProductByID);
router.get("/single-product-slug/:item_slug", fetchSingleProductBySlug);
router.get("/all-categories", fetchAllCategories);
router.get("/all-reviews", fetchReviews);
router.get("/all-product-reviews/:owner", fetchProductReviews);
router.get("/all-shipping-data", fetchAllShippingData);
router.get("/general-discount", fetchGeneralDiscount);

router.post("/make-order", makeOrder, orderSuccessfulEmail);

module.exports = router;
