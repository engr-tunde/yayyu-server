const express = require("express");
const {
  getUser,
  updateUserProfile,
  updateUserPassword,
  fetchUserOrders,
} = require("../../controllers/user/user-profile-controller");
const {
  verifyUserLoginToken,
} = require("../../controllers/user/user-auth-controller");
const { passwordUpdatedEmail } = require("../../services/emailServices");
const {
  validate,
  validateUpdateProfileUserParams,
  validateUpdatePasswordParams,
} = require("../../middlewares/validator");

const router = express.Router();

// Profile
router.get("/user", verifyUserLoginToken, getUser);
router.get("/orders", verifyUserLoginToken, fetchUserOrders);
router.put("/update-profile", verifyUserLoginToken, updateUserProfile);
router.put(
  "/update-password",
  verifyUserLoginToken,
  validateUpdatePasswordParams,
  validate,
  updateUserPassword,
  passwordUpdatedEmail
);

module.exports = router;
