const multer = require("multer");
const path = require("path");

const idStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/files/imgs/ids");
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
const idUpload = multer({ storage: idStorage });
const idImageUpload = idUpload.fields([
  { name: "iDFront", maxCount: 1 },
  { name: "iDBack", maxCount: 1 },
]);

module.exports = {
  idImageUpload,
};
