const { isValidObjectId } = require("mongoose");
const {
  sendError,
  sendLoginError,
  sendTryCtachError,
} = require("../utils/helpers");
const User = require("../models/user/User");
const ResetPasswordToken = require("../models/user/ResetPasswordToken");

const validateNewUser = async (req, res, next) => {
  req.body.email = req.body.email.toLowerCase();
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return sendError(res, "Email already exists. Please login instead.", 209);
    }
  } catch (err) {
    return sendTryCtachError(res, err);
  }
  next();
};

const isPasswordResetTokenValid = async (req, res, next) => {
  const { token, id } = req.query;

  if (!token || !id) return sendError(res, "Invalid request");

  if (!isValidObjectId(id)) return sendError(res, "Invalid user");

  const user = await User.findById(id);

  if (!user) return sendError(res, "User not found");

  const resToken = await ResetPasswordToken.findOne({ owner: user._id });
  if (!resToken) return sendError(res, "Reset token not found");

  const resetToken = resToken.token;

  if (token !== resetToken) {
    return sendError(res, "Reset token is invalid");
  }

  req.body.user = user;
  console.log({ user });
  next();
};

const validateLoginType = async (req, res, next) => {
  const { email, password } = req.body;

  let user;
  let userIdentity;

  userIdentity = email.toLowerCase();

  if (!email) {
    return sendLoginError(res, "email is missing", 1);
  }

  try {
    user = await User.findOne({ email: userIdentity });
  } catch (err) {
    return sendLoginError(res, err.message, 1, 500);
  }
  if (!user) {
    return sendLoginError(res, "Email not registered. Signup instead.", 1, 206);
  }

  req.body = {
    user,
    password,
  };

  next();
};

module.exports = {
  validateNewUser,
  isPasswordResetTokenValid,
  validateLoginType,
};
