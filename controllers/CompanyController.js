const Job = require("../models/Job")
const Application = require("../models/Application")
const { validationResult } = require("express-validator")

class CompanyController {
  static async showDashboard(req, res) {
    try {
      const jobs = await Job.findByCompanyId(req.user.id)
      const applications = await Application.findByCompanyId(req.user.id)
      const success = req.query.success

      res.render("company/dashboard", {
        title: "Company Dashboard - Elevate Workforce",
        jobs,
        applications,
        user: req.user,
        success,
      })
    } catch (error) {
      console.error("Dashboard error:", error)
      res.render("error", {
        message: "Failed to load dashboard",
        title: "Error",
        user: req.user,
      })
    }
  }

  static showCreateJob(req, res) {
    res.render("company/create-job", {
      title: "Post New Job - Elevate Workforce",
      errors: [],
      formData: {},
      user: req.user,
    })
  }

  static async createJob(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.render("company/create-job", {
        title: "Post New Job - Elevate Workforce",
        errors: errors.array(),
        formData: req.body,
        user: req.user,
      })
    }

    try {
      const jobData = {
        ...req.body,
        company_id: req.user.id,
      }
      await Job.create(jobData)
      res.redirect("/company/dashboard?success=job_created")
    } catch (error) {
      console.error("Create job error:", error)
      res.render("company/create-job", {
        title: "Post New Job - Elevate Workforce",
        errors: [{ msg: "Failed to create job. Please try again." }],
        formData: req.body,
        user: req.user,
      })
    }
  }

  static async showEditJob(req, res) {
    try {
      const job = await Job.findById(req.params.id)
      if (!job || job.company_id !== req.user.id) {
        return res.render("error", {
          message: "Job not found or access denied",
          title: "Error",
          user: req.user,
        })
      }

      res.render("company/edit-job", {
        title: "Edit Job - Elevate Workforce",
        job,
        errors: [],
        user: req.user,
      })
    } catch (error) {
      console.error("Edit job error:", error)
      res.render("error", {
        message: "Failed to load job",
        title: "Error",
        user: req.user,
      })
    }
  }

  static async updateJob(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      try {
        const job = await Job.findById(req.params.id)
        return res.render("company/edit-job", {
          title: "Edit Job - Elevate Workforce",
          job: { ...job, ...req.body },
          errors: errors.array(),
          user: req.user,
        })
      } catch (error) {
        return res.redirect("/company/dashboard?error=update_failed")
      }
    }

    try {
      const job = await Job.findById(req.params.id)
      if (!job || job.company_id !== req.user.id) {
        return res.render("error", {
          message: "Job not found or access denied",
          title: "Error",
          user: req.user,
        })
      }

      await Job.update(req.params.id, req.body)
      res.redirect("/company/dashboard?success=job_updated")
    } catch (error) {
      console.error("Update job error:", error)
      res.redirect("/company/dashboard?error=update_failed")
    }
  }

  static async deleteJob(req, res) {
    try {
      const job = await Job.findById(req.params.id)
      if (!job || job.company_id !== req.user.id) {
        return res.status(403).json({ error: "Access denied" })
      }

      await Job.delete(req.params.id)
      res.redirect("/company/dashboard?success=job_deleted")
    } catch (error) {
      console.error("Delete job error:", error)
      res.redirect("/company/dashboard?error=delete_failed")
    }
  }
}

module.exports = CompanyController
