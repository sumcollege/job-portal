const express = require("express")
const { body } = require("express-validator")
const AuthController = require("../controllers/AuthController")

const router = express.Router()

const registerValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("role").isIn(["jobseeker", "company"]).withMessage("Valid role is required"),
]

const loginValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
]

router.get("/register", AuthController.showRegister)
router.post("/register", registerValidation, AuthController.register)
router.get("/login", AuthController.showLogin)
router.post("/login", loginValidation, AuthController.login)
router.get("/logout", AuthController.logout)

module.exports = router
