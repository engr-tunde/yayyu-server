const express = require("express");
const {
  verifyAdminLoginToken,
} = require("../../controllers/admin/admin-auth-controller");
const { validateAddAdPost, validate } = require("../../middlewares/validator");

const router = express.Router();

module.exports = router;
