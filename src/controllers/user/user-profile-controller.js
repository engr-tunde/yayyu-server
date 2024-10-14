const User = require("../../models/user/User");
const {
  sendError,
  sendSuccess,
  badRequestError,
  sendTryCtachError,
  generateSlug,
  generateServiceID,
} = require("../../utils/helpers");
const UserReferral = require("../../models/user/UserReferral");
const bcrypt = require("bcryptjs");
const Transaction = require("../../models/user/Transaction");
const ServiceRequest = require("../../models/user/ServiceRequest");

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
      "Your profile contact data has been successfully updated",
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

const requestService = async (req, res, next) => {
  const userId = req.id;
  const rawiDFrontArray = req.files["iDFront"];
  if (!rawiDFrontArray) {
    return sendError(res, "Please add the ID front image or doc");
  }
  const rawiDBackArray = req.files["iDBack"];
  if (!rawiDBackArray) {
    return sendError(res, "Please add the ID back image or doc");
  }
  const namediDFront = rawiDFrontArray.map((a) => a.filename);
  const stringnifiediDFront = JSON.stringify(namediDFront);
  const iDFront = stringnifiediDFront.replace(/[^a-zA-Z0-9_.,]/g, "");

  const namediDBack = rawiDBackArray.map((a) => a.filename);
  const stringnifiediDBack = JSON.stringify(namediDBack);
  const iDBack = stringnifiediDBack.replace(/[^a-zA-Z0-9_.,]/g, "");

  const serviceSlug = generateServiceID(req.body?.service);

  const user = await User.findById(userId);
  if (!user) return sendError(res, "Invalid user profile");

  req.body = {
    ...req.body,
    iDFront,
    iDBack,
    owner: userId,
    name: user.name,
    email: user.email,
    serviceSlug: serviceSlug,
  };
  console.log("req body: ", req.body);

  try {
    const newServiceRequest = new ServiceRequest({ ...req.body });
    await newServiceRequest.save();
    req.body = { newServiceRequest };
    next();
  } catch (err) {
    return sendTryCtachError(res, err);
  }
};

const fetchUserServiceRequests = async (req, res) => {
  const userId = req.id;
  try {
    const trans = await ServiceRequest.find().limit({ owner: userId });
    console.log("trans", trans);
    const transactions = trans.filter((trans) => trans.owner === userId);
    if (!transactions) {
      return sendError(res, "Transaction record does not exist");
    }
    console.log("transactions", transactions);
    return res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    return sendError(
      res,
      `Unable to fetch the transaction record. Error - ${error}`
    );
  }
};

module.exports = {
  getUser,
  updateUserProfile,
  updateUserPassword,

  requestService,
  fetchUserServiceRequests,
};
