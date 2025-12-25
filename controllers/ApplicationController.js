const Application = require("../models/Application")
const Job = require("../models/Job")
const { validationResult } = require("express-validator")

class ApplicationController {
  static async apply(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const job = await Job.findById(req.params.jobId)
      if (!job) {
        return res.status(404).json({ error: "Job not found" })
      }

      const existingApplication = await Application.findByJobAndJobseeker(req.params.jobId, req.user.id)
      if (existingApplication) {
        return res.status(400).json({ error: "You have already applied for this job" })
      }

      const applicationData = {
        job_id: req.params.jobId,
        user_id: req.user.id,
        cover_letter: req.body.cover_letter,
      }

      await Application.create(applicationData)
      res.json({ success: true, message: "Application submitted successfully" })
    } catch (error) {
      console.error("Apply error:", error)
      res.status(500).json({ error: "Failed to submit application" })
    }
  }

  static async showMyApplications(req, res) {
    try {
      const applications = await Application.findByJobseekerId(req.user.id)
      res.render("applications/my-applications", {
        title: "My Applications - Elevate Workforce",
        applications,
        user: req.user,
      })
    } catch (error) {
      console.error("My applications error:", error)
      res.render("error", {
        message: "Failed to load applications",
        title: "Error",
        user: req.user,
      })
    }
  }

  static async updateStatus(req, res) {
    try {
      const { status } = req.body
      await Application.updateStatus(req.params.id, status)
      res.json({ success: true, message: "Application status updated" })
    } catch (error) {
      console.error("Update status error:", error)
      res.status(500).json({ error: "Failed to update status" })
    }
  }
}

module.exports = ApplicationController
