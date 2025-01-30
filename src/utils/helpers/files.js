const multer = require("multer");
const path = require("path");

const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/files/imgs/products");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.originalname.replace(/[^a-zA-Z0-9_.,]/g, "") +
        "_" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});
const productUpload = multer({ storage: productStorage });
const productImageUpload = productUpload.fields([
  { name: "img", maxCount: 1 },
  { name: "images", maxCount: 30 },
]);

module.exports = {
  productImageUpload,
};
