const express = require("express")
const { body } = require("express-validator")
const ApplicationController = require("../controllers/ApplicationController")
const { authenticateToken, requireRole } = require("../middleware/auth")

const router = express.Router()

const applicationValidation = [body("cover_letter").notEmpty().withMessage("Cover letter is required")]

router.use(authenticateToken)

router.post("/apply/:jobId", requireRole("jobseeker"), applicationValidation, ApplicationController.apply)
router.get("/my-applications", requireRole("jobseeker"), ApplicationController.showMyApplications)
router.post("/:id/status", requireRole("company"), ApplicationController.updateStatus)

module.exports = router
