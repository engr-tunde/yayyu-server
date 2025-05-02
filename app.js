require("dotenv").config();
require("./db");
const express = require("express");

const generalRouter = require("./src/routes/general/general-routes");
const userAuthRouter = require("./src/routes/user/user-auth-routes");
const userProfileRouter = require("./src/routes/user/user-profile-routes");

const adminAuthRouter = require("./src/routes/admin/admin-auth-routes");
const shopManagementRouter = require("./src/routes/admin/admin-shop-routes");
const adminManagementRouter = require("./src/routes/admin/admin-admin-routes");
const userManagementRouter = require("./src/routes/admin/admin-user-routes");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const { connect } = require("./db");

const app = express();
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:3000",
      "http://192.168.0.159:3000",
      "https://192.168.0.159:3000",
      "http://localhost:5173",
      "http://192.168.0.159:5173",
      "http://localhost:5174",
      "https://yayyu-website.onrender.com",
    ],
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));
app.use("/api/v1/user-auth", userAuthRouter);
app.use("/api/v1/user-profile", userProfileRouter);
app.use("/api/v1/admin-auth", adminAuthRouter);
app.use("/api/v1/shop-management", shopManagementRouter);
app.use("/api/v1/admin-management", adminManagementRouter);
app.use("/api/v1/user-management", userManagementRouter);
app.use("/api/v1/general", generalRouter);

app.get("/", (req, res) => {
  res.send(
    "Hello, welcome to this RESTful API. Server is running with latest update in October 2024\n -"
  );
});

app.listen(process.env.APP_PORT || 7000, () => {
  connect();
  console.log(`Listening to requests on port ${process.env.APP_PORT}`);
  setTimeout(() => {
    console.log("server is live");
  }, 300000);
});
