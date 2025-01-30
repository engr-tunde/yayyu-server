const Order = require("../../models/user/Order");
const User = require("../../models/user/User");
const { sendError, sendSuccess } = require("../../utils/helpers");
const bcrypt = require("bcryptjs");

const getUser = async (req, res) => {
  const userId = req.id;
  let user;
  try {
    user = await User.findById(userId, "-password");
  } catch (err) {
    return sendError(res, err.message);
  }
  if (!user) {
    return sendError(res, "User not found");
  }
  return sendSuccess(res, null, user);
};

const updateUserProfile = async (req, res) => {
  const userId = req.id;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: req.body },
      { new: true }
    );
    return sendSuccess(
      res,
      "Your profile data has been successfully updated",
      user
    );
  } catch (error) {
    console.log(err);
    return sendError(res, "Unable to update your profile data");
  }
};

const updateUserPassword = async (req, res, next) => {
  const userId = req.id;
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(userId);
  if (!user) return sendError(res, "Invalid user profile");

  const isCurrentPasswordCorrect = bcrypt.compareSync(
    oldPassword,
    user.password
  );
  if (!isCurrentPasswordCorrect)
    return sendError(res, "Incorrect current password provided");

  const isPasswordSame = bcrypt.compareSync(newPassword, user.password);
  if (isPasswordSame)
    return sendError(
      res,
      "New password must be different from the old password"
    );

  const hashedPassword = bcrypt.hashSync(newPassword);
  user.password = hashedPassword;

  try {
    await user.save();
    req.body = {
      user,
    };
    next();
  } catch (error) {
    console.log(err);
    return sendError(res, err);
  }
};

const fetchUserOrders = async (req, res) => {
  const userId = req.id;
  try {
    const orders = await Order.find({ owner: userId }).limit(req.query.limit);
    console.log({ orders });
    return sendSuccess(res, "Successfully fetched orders", orders);
  } catch (error) {
    return sendError(res, "Unable to fetch the users data");
  }
};

module.exports = {
  getUser,
  updateUserProfile,
  updateUserPassword,
  fetchUserOrders,
};
