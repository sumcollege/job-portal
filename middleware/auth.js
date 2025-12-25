const jwt = require("jsonwebtoken")
const User = require("../models/User")

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.token

    if (!token) {
      return res.redirect("/auth/login")
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId)

    if (!user) {
      res.clearCookie("token")
      return res.redirect("/auth/login")
    }

    req.user = user
    next()
  } catch (error) {
    console.error("Auth error:", error)
    res.clearCookie("token")
    return res.redirect("/auth/login")
  }
}

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(decoded.userId)
      if (user) {
        req.user = user
      }
    }
  } catch (error) {
    console.error("Optional auth error:", error)
    res.clearCookie("token")
  }
  next()
}

const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).render("error", {
        message: "Access denied. Insufficient permissions.",
        title: "Access Denied",
        user: req.user || null,
      })
    }
    next()
  }
}

module.exports = { authenticateToken, optionalAuth, requireRole }
