const Category = require("../../models/general/Category");
const Product = require("../../models/general/Product");
const {
  sendError,
  sendSuccess,
  generateSlug,
  badRequestError,
} = require("../../utils/helpers");
const path = require("path");
const fs = require("fs");
const Shipping = require("../../models/general/Shipping");
const Discount = require("../../models/general/Discount");
const Order = require("../../models/user/Order");

const addProduct = async (req, res) => {
  const rawImgArray = req.files && req.files["img"];
  if (!rawImgArray) {
    return badRequestError(res, "Product cover image is missing");
  }
  const namedImg = rawImgArray?.map((a) => a.filename);
  const stringnifiedImg = JSON.stringify(namedImg);
  const formmatedImg = stringnifiedImg.replace(/[^a-zA-Z0-9_.,]/g, "");
  req.body.img = formmatedImg.replace(/[,]/g, ", ");

  const rawImagesArray = req.files && req.files["images"];

  if (rawImagesArray) {
    const namedImage = rawImagesArray?.map((a) => a.filename);
    const stringnifiedImages = JSON.stringify(namedImage);
    const formmatedImages = stringnifiedImages?.replace(/[^a-zA-Z0-9_.,]/g, "");
    req.body.images = formmatedImages?.replace(/[,]/g, ", ");
  }
  let item_slug = await generateSlug(req.body.item_name.toLowerCase());
  if (req.body.colors) {
    item_slug =
      item_slug +
      "-" +
      req.body.new_price +
      "-" +
      req.body.colors.split(";")[0].toLowerCase();
    req.body.colors = req.body.colors.toLowerCase().split("; ");
  } else {
    item_slug = item_slug + "-" + req.body.new_price;
  }

  try {
    const productExists = await Product.findOne({ item_slug });
    if (productExists) {
      return sendError(res, "Product already exists in shop");
    }

    // req.body.added_by = req.id;
    req.body.item_slug = item_slug;
    req.body.description = req.body.specification;
    req.body.original_price = Number(req.body.original_price);
    req.body.new_price = Number(req.body.new_price);
    req.body.specification = req.body.specification.split("; ");
    const newProduct = new Product(req.body);

    await newProduct.save();
    return sendSuccess(res, "Successfully added a new product", newProduct);
  } catch (err) {
    console.log(err);
    return sendError(res, "Unable to add a new product");
  }
};

const editProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    return sendSuccess(res, "Successfully updated the product data", product);
  } catch (err) {
    console.log(err);
    return sendError(res, "Unable to update the product");
  }
};

const editProductCover = async (req, res) => {
  const rawImgArray = req.files && req.files["img"];
  if (!rawImgArray) {
    return badRequestError(res, "Product cover image is missing");
  }
  const namedImg = rawImgArray?.map((a) => a.filename);
  const stringnifiedImg = JSON.stringify(namedImg);
  const formmatedImg = stringnifiedImg.replace(/[^a-zA-Z0-9_.,]/g, "");
  req.body.img = formmatedImg.replace(/[,]/g, ", ");

  try {
    const item = await Product.findById(req.params.id);
    if (item) {
      console.log("item", item);
      let image = item.img;
      const file_path = path.join("public/files/imgs/products", image);
      console.log(file_path);

      fs.unlink(file_path, (err) => {
        if (err) {
          console.log("there was a problem deleting the file from folder.");
        } else {
          console.log("file deteled from folder");
        }
      });
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    return sendSuccess(
      res,
      "Successfully updated the product cover image",
      product
    );
  } catch (err) {
    console.log(err);
    return sendError(res, "Unable to update the product");
  }
};

const deleteProduct = async (req, res) => {
  try {
    const item = await Product.findById(req.params.id);
    if (item) {
      console.log("item", item);
      let image = item.img;
      let images = item.images.split("; ");
      const file_path = path.join("public/files/imgs/products", image);
      console.log(file_path);
      fs.unlink(file_path, (err) => {
        if (err) {
          console.log("error deleting file", err);
          return;
        }
        console.log("file deleted successfully");
        images.forEach((element) => {
          const file_path2 = path.join("public/files/imgs/products", element);
          fs.unlink(file_path2, (err) => {
            if (err) {
              console.log(`error deleting file ${element}`, err);
              // return;
            } else {
              console.log(`file ${element} deleted successfully`);
            }
          });
        });
      });
      await Product.findByIdAndDelete(req.params.id);
    }
    return sendSuccess(res, "Successfully deleted the product data");
  } catch (err) {
    console.log(err);
    return sendError(res, "Unable to delete the product data");
  }
};

const addCategory = async (req, res) => {
  const category =
    req.body.category.charAt(0).toUpperCase() +
    String(req.body.category.toLowerCase()).slice(1);
  try {
    const categoryExists = await Category.findOne({ category });
    if (categoryExists) {
      return sendError(res, "Category already exists");
    }
    const category_slug = await generateSlug(category.toLowerCase());
    const newCategory = new Category({
      category,
      category_slug,
    });
    await newCategory.save();
    return sendSuccess(res, "Successfully added a new category", newCategory);
  } catch (err) {
    console.log(err);
    return sendError(res, "Unable to add a new category");
  }
};

const editCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    return sendSuccess(res, "Successfully updated the category data", category);
  } catch (err) {
    console.log(err);
    return sendError(res, "Unable to update the category");
  }
};

const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    return sendSuccess(res, "Successfully deleted the category data");
  } catch (err) {
    console.log(err);
    return sendError(res, "Unable to delete the category");
  }
};

const addShippingData = async (req, res) => {
  req.body.fee = Number(req.body.fee);
  try {
    const shippingExists = await Shipping.findOne({
      location: req.body.location,
    });
    if (shippingExists) {
      return sendError(res, "Shipping data already exists");
    }
    const newShipping = new Shipping(req.body);
    await newShipping.save();
    return sendSuccess(
      res,
      "Successfully added a new shipping details",
      newShipping
    );
  } catch (err) {
    console.log(err);
    return sendError(res, "Unable to add a new shipping data");
  }
};

const editShippingData = async (req, res) => {
  try {
    const shipping = await Shipping.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    return sendSuccess(res, "Successfully updated the shipping data", shipping);
  } catch (err) {
    console.log(err);
    return sendError(res, "Unable to update the shipping data");
  }
};

const deleteShippingData = async (req, res) => {
  try {
    await Shipping.findByIdAndDelete(req.params.id);
    return sendSuccess(res, "Successfully deleted the shipping data");
  } catch (err) {
    console.log(err);
    return sendError(res, "Unable to delete the category");
  }
};

const addDiscount = async (req, res) => {
  req.body.percent = Number(req.body.percent);
  try {
    const discount = await Discount.find();
    if (discount.length) {
      return sendError(
        res,
        "General discount data already exists. Update instead"
      );
    }
    const newDiscount = new Discount(req.body);
    await newDiscount.save();
    return sendSuccess(
      res,
      "Successfully added a new discount details",
      newDiscount
    );
  } catch (err) {
    console.log(err);
    return sendError(res, "Unable to add a new discount data");
  }
};

const editDiscount = async (req, res) => {
  try {
    const discount = await Discount.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    return sendSuccess(res, "Successfully updated the discount data", discount);
  } catch (err) {
    console.log(err);
    return sendError(res, "Unable to update the discount data");
  }
};

const deleteDiscount = async (req, res) => {
  try {
    await Discount.findByIdAndDelete(req.params.id);
    return sendSuccess(res, "Successfully deleted the discount data");
  } catch (err) {
    console.log(err);
    return sendError(res, "Unable to delete the category");
  }
};

const fetchOrders = async (req, res, next) => {
  try {
    const allOrders = await Order.find().limit(req.query.limit);
    return sendSuccess(res, "Successfully fetched ll orders", allOrders);
  } catch (error) {
    console.log(error);
    return sendError(res, "Unable to fetch the admins data");
  }
};

const fetchSingleOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return sendError(res, "Order does not exist");
    }
    return sendSuccess(res, "Successfully fetched ll orders", order);
  } catch (error) {
    console.log(error);
    return sendError(res, "Unable to fetch the order data");
  }
};

const completeOrder = async (req, res) => {
  console.log("delete order called");
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return badRequestError(res, "Unable to verify order details");
    }
    if (order.delivery_status === "Completed") {
      return badRequestError(
        res,
        `Order ${order.order_title} is already completed`
      );
    }
    order.delivery_status = "Completed";
    await order.save();
    console.log("order", order);
    return sendSuccess(
      res,
      `Order ${order.order_title} has been marked as completed`
    );
  } catch (err) {
    log(err);
    return sendError(res, "Unable to complete order");
  }
};

const cancelOrder = async (req, res) => {
  console.log("cancel order called");
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return badRequestError(res, "Unable to verify order details");
    }
    if (order.delivery_status === "Canceled") {
      return badRequestError(
        res,
        `Order ${order.order_title} is already cancelled`
      );
    }
    order.delivery_status = "Canceled";
    await order.save();
    console.log("order", order);
    return sendSuccess(
      res,
      `Order ${order.order_title} has been successfully canceled`
    );
  } catch (err) {
    log(err);
    return sendError(res, "Unable to cancel order");
  }
};

const pendOrder = async (req, res) => {
  console.log("pend order called");
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return badRequestError(res, "Unable to verify order details");
    }
    if (order.delivery_status === "Pending") {
      return badRequestError(
        res,
        `Order ${order.order_title} is already pending`
      );
    }
    order.delivery_status = "Pending";
    await order.save();
    console.log("order", order);
    return sendSuccess(
      res,
      `Order ${order.order_title} has been marked as pending`
    );
  } catch (err) {
    log(err);
    return sendError(res, "Unable to pend order");
  }
};

const deleteOrder = async (req, res) => {
  console.log("delete order called");
  try {
    await Order.findByIdAndDelete(req.params.id);
    return sendSuccess(res, "Successfully deleted the order");
  } catch (err) {
    console.log(err);
    return sendError(res, "Unable to delete the order");
  }
};

module.exports = {
  addProduct,
  editProduct,
  editProductCover,
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
};
