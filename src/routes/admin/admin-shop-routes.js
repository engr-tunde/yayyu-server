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
} = require("../../controllers/admin/admin-shop-controllers");
const { productImageUpload } = require("../../utils/helpers/files");

const router = express.Router();

router.post(
  "/add-product",
  verifyAdminLoginToken,
  productImageUpload,
  addProduct
);
router.put(
  "/update-product/:id",
  verifyAdminLoginToken,
  productImageUpload,
  editProduct
);
router.delete("/delete-product/:id", verifyAdminLoginToken, deleteProduct);

router.post("/add-category", verifyAdminLoginToken, addCategory);
router.put("/update-category/:id", verifyAdminLoginToken, editCategory);
router.delete("/delete-category/:id", verifyAdminLoginToken, deleteCategory);

router.post("/add-shipping", verifyAdminLoginToken, addShippingData);
router.put("/update-shipping/:id", verifyAdminLoginToken, editShippingData);
router.delete(
  "/delete-shipping/:id",
  verifyAdminLoginToken,
  deleteShippingData
);

router.post("/add-discount", verifyAdminLoginToken, addDiscount);
router.put("/update-discount/:id", verifyAdminLoginToken, editDiscount);
router.delete("/delete-discount/:id", verifyAdminLoginToken, deleteDiscount);

module.exports = router;
