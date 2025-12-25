const express = require("express")
const { body } = require("express-validator")
const CompanyController = require("../controllers/CompanyController")
const { authenticateToken, requireRole } = require("../middleware/auth")

const router = express.Router()

const jobValidation = [
  body("title").notEmpty().withMessage("Job title is required"),
  body("description").notEmpty().withMessage("Job description is required"),
  body("location").notEmpty().withMessage("Location is required"),
  body("job_type").isIn(["full-time", "part-time", "contract", "internship"]).withMessage("Valid job type is required"),
]

router.use(authenticateToken, requireRole("company"))

router.get("/dashboard", CompanyController.showDashboard)
router.get("/jobs/create", CompanyController.showCreateJob)
router.post("/jobs/create", jobValidation, CompanyController.createJob)
router.get("/jobs/:id/edit", CompanyController.showEditJob)
router.post("/jobs/:id/edit", jobValidation, CompanyController.updateJob)
router.post("/jobs/:id/delete", CompanyController.deleteJob)

module.exports = router
