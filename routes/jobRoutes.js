const express = require("express")
const JobController = require("../controllers/JobController")
const { optionalAuth } = require("../middleware/auth")

const router = express.Router()

router.use(optionalAuth)

router.get("/", JobController.showJobs)
router.get("/:id", JobController.showJob)

module.exports = router
