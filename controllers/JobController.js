const Job = require("../models/Job")
const Application = require("../models/Application")

class JobController {
  static async showJobs(req, res) {
    try {
      const page = Number.parseInt(req.query.page) || 1
      const limit = 6
      const offset = (page - 1) * limit

      const jobs = await Job.findAll(limit, offset)
      const totalJobs = await Job.getTotalCount()
      const totalPages = Math.ceil(totalJobs / limit)

      res.render("jobs/index", {
        title: "Browse Jobs - Elevate Workforce",
        jobs,
        currentPage: page,
        totalPages,
        user: req.user || null,
      })
    } catch (error) {
      console.error("Error loading jobs:", error)
      res.render("error", {
        message: "Failed to load jobs",
        title: "Error",
        user: req.user || null,
      })
    }
  }

  static async showJob(req, res) {
    try {
      const job = await Job.findById(req.params.id)
      if (!job) {
        return res.render("error", {
          message: "Job not found",
          title: "Job Not Found",
          user: req.user || null,
        })
      }

      let hasApplied = false
      if (req.user && req.user.role === "jobseeker") {
        const application = await Application.findByJobAndJobseeker(job.id, req.user.id)
        hasApplied = !!application
      }

      res.render("jobs/show", {
        title: `${job.title} - Elevate Workforce`,
        job,
        hasApplied,
        user: req.user || null,
      })
    } catch (error) {
      console.error("Error loading job details:", error)
      res.render("error", {
        message: "Failed to load job details",
        title: "Error",
        user: req.user || null,
      })
    }
  }
}

module.exports = JobController
