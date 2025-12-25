const User = require("../models/User")
const jwt = require("jsonwebtoken")
const { validationResult } = require("express-validator")

class AuthController {
  static showRegister(req, res) {
    res.render("auth/register", {
      title: "Register - Elevate Workforce",
      errors: [],
      formData: {},
    })
  }

  static showLogin(req, res) {
    const registered = req.query.registered === "true"
    res.render("auth/login", {
      title: "Login - Elevate Workforce",
      errors: [],
      formData: {},
      registered: registered,
    })
  }

  static async register(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.render("auth/register", {
        title: "Register - Elevate Workforce",
        errors: errors.array(),
        formData: req.body,
      })
    }

    try {
      const existingUser = await User.findByEmail(req.body.email)
      if (existingUser) {
        return res.render("auth/register", {
          title: "Register - Elevate Workforce",
          errors: [{ msg: "Email already exists" }],
          formData: req.body,
        })
      }

      await User.create(req.body)
      res.redirect("/auth/login?registered=true")
    } catch (error) {
      console.error("Registration error:", error)
      res.render("auth/register", {
        title: "Register - Elevate Workforce",
        errors: [{ msg: "Registration failed. Please try again." }],
        formData: req.body,
      })
    }
  }

  static async login(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.render("auth/login", {
        title: "Login - Elevate Workforce",
        errors: errors.array(),
        formData: req.body,
        registered: false,
      })
    }

    try {
      const user = await User.findByEmail(req.body.email)
      if (!user || !(await user.validatePassword(req.body.password))) {
        return res.render("auth/login", {
          title: "Login - Elevate Workforce",
          errors: [{ msg: "Invalid email or password" }],
          formData: req.body,
          registered: false,
        })
      }

      const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "24h" })

      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      })

      if (user.role === "company") {
        res.redirect("/company/dashboard")
      } else {
        res.redirect("/jobs")
      }
    } catch (error) {
      console.error("Login error:", error)
      res.render("auth/login", {
        title: "Login - Elevate Workforce",
        errors: [{ msg: "Login failed. Please try again." }],
        formData: req.body,
        registered: false,
      })
    }
  }

  static logout(req, res) {
    res.clearCookie("token")
    res.redirect("/")
  }
}

module.exports = AuthController
