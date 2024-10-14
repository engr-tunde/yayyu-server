const express = require("express");
const {
  getUser,
  updateUserProfile,
  updateUserPassword,
  requestService,
  fetchUserServiceRequests,
} = require("../../controllers/user/user-profile-controller");
const {
  verifyUserLoginToken,
} = require("../../controllers/user/user-auth-controller");
const {
  passwordUpdatedEmail,
  requestSentEmail,
} = require("../../services/emailServices");
const {
  validate,
  validateUpdateProfileUserParams,
  validateUpdatePasswordParams,
  validateRequestServiceParams,
} = require("../../middlewares/validator");
const { idImageUpload } = require("../../utils/helpers/files");

const router = express.Router();

// Profile
router.get("/user", verifyUserLoginToken, getUser);
router.post(
  "/request-service",
  verifyUserLoginToken,
  idImageUpload,
  requestService,
  requestSentEmail
);
router.get("/my-requests", verifyUserLoginToken, fetchUserServiceRequests);
router.put(
  "/update-profile",
  verifyUserLoginToken,
  validateUpdateProfileUserParams,
  validate,
  updateUserProfile
);
router.put(
  "/update-password",
  verifyUserLoginToken,
  validateUpdatePasswordParams,
  validate,
  updateUserPassword,
  passwordUpdatedEmail
);

module.exports = router;
