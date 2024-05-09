const multer = require('multer');
const path = require('path');

const careerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/files/docs/job-applications');
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.originalname.replace(/[^a-zA-Z0-9_.,]/g, '') +
        '_' +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});
const carUpload = multer({ storage: careerStorage });
const careerAppDocUpload = carUpload.fields([{ name: 'documents', maxCount: 10 }]);

const postStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/files/imgs/posts');
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.originalname.replace(/[^a-zA-Z0-9_.,]/g, '') +
        '_' +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});
const postUpload = multer({ storage: postStorage });
const postImageUpload = postUpload.fields([{ name: 'cover_image', maxCount: 1 }]);

// Admin avatar
const adminStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/files/imgs/admins');
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.originalname.replace(/[^a-zA-Z0-9_.,]/g, '') +
        '_' +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});
const adminUpload = multer({ storage: adminStorage });
const adminImageUpload = adminUpload.fields([{ name: 'avatar', maxCount: 1 }]);

// User
const userStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/files/imgs/users');
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.originalname.replace(/[^a-zA-Z0-9_.,]/g, '') +
        '_' +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});
const userUpload = multer({ storage: userStorage });
const userImageUpload = userUpload.fields([{ name: 'avatar', maxCount: 1 }]);

module.exports = {
  careerAppDocUpload,
  postImageUpload,
  adminImageUpload,
  userImageUpload,
};
