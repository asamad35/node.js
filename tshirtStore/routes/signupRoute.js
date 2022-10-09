const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getLoggedInUserDetails,
  changePassword,
  updateUserProfile,
  adminAllUser,
  managerAllUser,
  adminGetOneUser,
  adminUpdateOneUser,
  adminDeleteOneUser,
} = require("../controllers/userController");

const { isLoggedIn, customRole } = require("../middlewares/user");

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgotpassword").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/userdashboard").get(isLoggedIn, getLoggedInUserDetails);
router.route("/changepassword").post(isLoggedIn, changePassword);
router.route("/userdashboard/update").post(isLoggedIn, updateUserProfile);

// admin
router.route("/admin/users").get(isLoggedIn, customRole("admin"), adminAllUser);
router
  .route("/admin/user/:id")
  .get(isLoggedIn, customRole("admin"), adminGetOneUser);
router
  .route("/admin/user/:id")
  .post(isLoggedIn, customRole("admin"), adminUpdateOneUser);
router
  .route("/admin/user/:id")
  .delete(isLoggedIn, customRole("admin"), adminDeleteOneUser);
// manager
router
  .route("/manager/users")
  .get(isLoggedIn, customRole("manager"), managerAllUser);

module.exports = router;
