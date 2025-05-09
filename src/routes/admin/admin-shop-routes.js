const express = require("express");

const {
  verifyAdminLoginToken,
} = require("../../controllers/admin/admin-auth-controller");
const {
  addProduct,
  editProduct,
  deleteProduct,
  addCategory,
  editCategory,
  deleteCategory,
  addShippingData,
  editShippingData,
  deleteShippingData,
  addDiscount,
  editDiscount,
  deleteDiscount,
  fetchOrders,
  fetchSingleOrder,
  completeOrder,
  cancelOrder,
  pendOrder,
  deleteOrder,
  editProductCover,
} = require("../../controllers/admin/admin-shop-controllers");
const { productImageUpload } = require("../../utils/helpers/files");
const {
  fetchAllProducts,
  fetchAllCategories,
  fetchAllShippingData,
  fetchGeneralDiscount,
  fetchSingleProductByID,
  fetchSingleProductBySlug,
} = require("../../controllers/general/general-controllers");

const router = express.Router();

router.get("/fetch-all-products", verifyAdminLoginToken, fetchAllProducts);
router.get("/single-product/:id", fetchSingleProductByID);
router.get("/single-product-slug/:item_slug", fetchSingleProductBySlug);
router.post(
  "/add-product",
  verifyAdminLoginToken,
  productImageUpload,
  addProduct
);
router.put("/update-product/:id", verifyAdminLoginToken, editProduct);
router.put(
  "/update-product-cover-img/:id",
  verifyAdminLoginToken,
  productImageUpload,
  editProductCover
);
router.delete("/delete-product/:id", verifyAdminLoginToken, deleteProduct);

router.get("/fetch-categories", verifyAdminLoginToken, fetchAllCategories);
router.post("/add-category", verifyAdminLoginToken, addCategory);
router.put("/update-category/:id", verifyAdminLoginToken, editCategory);
router.delete("/delete-category/:id", verifyAdminLoginToken, deleteCategory);

router.get("/fetch-shipping-data", verifyAdminLoginToken, fetchAllShippingData);
router.post("/add-shipping", verifyAdminLoginToken, addShippingData);
router.put("/update-shipping/:id", verifyAdminLoginToken, editShippingData);
router.delete(
  "/delete-shipping/:id",
  verifyAdminLoginToken,
  deleteShippingData
);

router.get("/fetch-discount-data", verifyAdminLoginToken, fetchGeneralDiscount);
router.post("/add-discount", verifyAdminLoginToken, addDiscount);
router.put("/update-discount/:id", verifyAdminLoginToken, editDiscount);
router.delete("/delete-discount/:id", verifyAdminLoginToken, deleteDiscount);

router.get("/fetch-all-orders", verifyAdminLoginToken, fetchOrders);
router.get("/fetch-order/:id", verifyAdminLoginToken, fetchSingleOrder);
router.put("/complete-order/:id", verifyAdminLoginToken, completeOrder);
router.put("/cancel-order/:id", verifyAdminLoginToken, cancelOrder);
router.put("/pend-order/:id", verifyAdminLoginToken, pendOrder);
router.delete("/delete-order/:id", verifyAdminLoginToken, deleteOrder);
module.exports = router;
