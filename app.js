require("dotenv").config();
require("./db");
const express = require("express");

const generalRouter = require("./src/routes/admin/general-routes");

const userAuthRouter = require("./src/routes/user/user-auth-routes");
const userProfileRouter = require("./src/routes/user/user-profile-routes");

const adminAuthRouter = require("./src/routes/admin/admin-auth-routes");
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
      "http://localhost:5173",
      "http://localhost:5174",
      "http://elder-intelligence.vercel.app",
      "https://elder-intelligence.vercel.app",
      "https://elder-intelligence-admin.vercel.app",
      "http://admin.elderintelligence.com",
      "https://admin.elderintelligence.com",
      "https://elderintelligence.com",
      "http://elderintelligence.com",
    ],
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));
app.use("/api/v1/user-auth", userAuthRouter);
app.use("/api/v1/user-profile", userProfileRouter);
app.use("/api/v1/admin-auth", adminAuthRouter);
app.use("/api/v1/admin-management", adminManagementRouter);
app.use("/api/v1/user-management", userManagementRouter);
app.use("/api/v1/general", generalRouter);

app.get("/", (req, res) => {
  res.send(
    "Hello, welcome to Elders Intelligence app. Server is running with latest update in July 2024\n -"
  );
});

app.listen(process.env.APP_PORT || 7000, () => {
  connect();
  console.log(`Listening to requests on port ${process.env.APP_PORT}`);
  setTimeout(() => {
    console.log("server is live");
  }, 300000);
});
