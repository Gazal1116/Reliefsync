const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { registerUser, loginUser } = require("../controllers/authcontroller");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "reliefsync-dev-secret";

const createToken = (user) =>
  jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

// Standard Auth
router.post("/register", registerUser);
router.post("/login", loginUser);

// Google Auth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  (req, res) => {
    // Successful authentication
    const token = createToken(req.user);
    const userData = encodeURIComponent(JSON.stringify({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      avatar: req.user.avatar
    }));
    
    // Redirect to frontend with token and user data
    res.redirect(`${process.env.FRONTEND_URL}/google-callback?token=${token}&user=${userData}`);
  }
);

module.exports = router;
