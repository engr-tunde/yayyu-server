const express = require("express");
const {
  verifyAdminLoginToken,
} = require("../../controllers/admin/admin-auth-controller");
const {
  updateUserProfile,
  deleteUser,
  fetchAllUsers,
  fetchSingleUser,
  blockUser,
  unblockUser,
} = require("../../controllers/admin/admin-user-controller");
const { validate } = require("../../middlewares/validator");

const router = express.Router();

router.put("/update-user/:id", updateUserProfile);
router.put("/block-user/:id", blockUser);
router.put("/unblock-user/:id", unblockUser);

router.delete("/delete-user/:id", deleteUser);
router.get("/fetch-all-users", fetchAllUsers);
router.get("/fetch-single-user/:id", fetchSingleUser);

module.exports = router;
