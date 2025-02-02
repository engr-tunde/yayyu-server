const Category = require("../../models/general/Category");
const Product = require("../../models/general/Product");
const { sendError, sendSuccess, generateSlug } = require("../../utils/helpers");
const path = require("path");
const fs = require("fs");
const Shipping = require("../../models/general/Shipping");
const Discount = require("../../models/general/Discount");

const addProduct = async (req, res) => {
  if (!req.files) sendError(res, "Product images are missing");
  let img;
  let images;
  if (req.files) {
    console.log(req.files);
    const rawImagesArray = req.files && req.files["images"];
    const namedImage = rawImagesArray?.map((a) => a.filename);
    const stringnifiedImages = JSON.stringify(namedImage);
    const formmatedImages = stringnifiedImages?.replace(/[^a-zA-Z0-9_.,]/g, "");
    images = formmatedImages?.replace(/[,]/g, ", ");

    const rawImgArray = req.files && req.files["img"];
    const namedImg = rawImgArray?.map((a) => a.filename);
    const stringnifiedImg = JSON.stringify(namedImg);
    const formmatedImg = stringnifiedImg.replace(/[^a-zA-Z0-9_.,]/g, "");
    img = formmatedImg.replace(/[,]/g, ", ");
  }
  let item_slug = await generateSlug(req.body.item_name.toLowerCase());
  if (req.body.colors) {
    item_slug =
      item_slug +
      "-" +
      req.body.new_price +
      "-" +
      req.body.colors.split(",")[0].toLowerCase();
    req.body.colors = req.body.colors.toLowerCase().split(", ");
  } else {
    item_slug = item_slug + "-" + req.body.new_price;
  }

  try {
    const productExists = await Product.findOne({ item_slug });
    if (productExists) {
      return sendError(res, "Product already exists in shop");
    }

    req.body.images = images;
    req.body.img = img;
    req.body.added_by = req.id;
    req.body.item_slug = item_slug;
    req.body.description = req.body.specification;
    req.body.original_price = Number(req.body.original_price);
    req.body.new_price = Number(req.body.new_price);
    req.body.specification = req.body.specification.split(". ");
    const newProduct = new Product(req.body);

    await newProduct.save();
    return sendSuccess(res, "Successfully added a new product", newProduct);
  } catch (err) {
    console.log(err);
    return sendError(res, "Unable to add a new product");
  }
};

const editProduct = async (req, res) => {
  let files;
  files = req?.files;
  if (files) {
    if (req.files["img"]) {
      const rawImgArray = req.files["img"];
      const namedImg = rawImgArray.map((a) => a.filename);
      const stringnifiedImg = JSON.stringify(namedImg);
      const formmatedImg = stringnifiedImg.replace(/[^a-zA-Z0-9_.,]/g, "");
      const img = formmatedImg.replace(/[,]/g, ", ");
      req.body.img = img;
    }
    if (req.files["images"]) {
      const rawImagesArray = req.files && req.files["images"];
      const namedImage = rawImagesArray?.map((a) => a.filename);
      const stringnifiedImages = JSON.stringify(namedImage);
      const formmatedImages = stringnifiedImages?.replace(
        /[^a-zA-Z0-9_.,]/g,
        ""
      );
      const images = formmatedImages?.replace(/[,]/g, ", ");
      req.body.images = images;
    }
  }
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

const deleteProduct = async (req, res) => {
  try {
    const item = await Product.findById(req.params.id);
    if (item) {
      console.log("item", item);
      let image = item.img;
      let images = item.images.split(", ");
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
              return;
            }
            console.log(`file ${element} deleted successfully`);
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

module.exports = {
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
};
