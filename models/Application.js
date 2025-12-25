const db = require("../config/database")

class Application {
  constructor(data) {
    this.id = data.id
    this.job_id = data.job_id
    this.user_id = data.user_id
    this.cover_letter = data.cover_letter
    this.status = data.status
    this.applied_at = data.applied_at
    this.job_title = data.job_title
    this.jobseeker_name = data.jobseeker_name
    this.jobseeker_email = data.jobseeker_email
    this.company_name = data.company_name
  }

  static async create(applicationData) {
    try {
      const [result] = await db.execute("INSERT INTO applications (job_id, user_id, cover_letter) VALUES (?, ?, ?)", [
        applicationData.job_id,
        applicationData.user_id,
        applicationData.cover_letter,
      ])
      return result.insertId
    } catch (error) {
      console.error("Error creating application:", error)
      throw error
    }
  }

  static async findByJobAndJobseeker(jobId, userId) {
    try {
      const [rows] = await db.execute("SELECT * FROM applications WHERE job_id = ? AND user_id = ?", [jobId, userId])
      return rows.length > 0 ? new Application(rows[0]) : null
    } catch (error) {
      console.error("Error finding application:", error)
      return null
    }
  }

  static async findByCompanyId(companyId) {
    try {
      const [rows] = await db.execute(
        `SELECT a.*, j.title as job_title, u.name as jobseeker_name, u.email as jobseeker_email
         FROM applications a
         JOIN jobs j ON a.job_id = j.id
         JOIN users u ON a.user_id = u.id
         WHERE j.company_id = ?
         ORDER BY a.applied_at DESC`,
        [companyId],
      )
      return rows.map((row) => new Application(row))
    } catch (error) {
      console.error("Error finding applications by company:", error)
      return []
    }
  }

  static async findByJobseekerId(jobseekerId) {
    try {
      const [rows] = await db.execute(
        `SELECT a.*, j.title as job_title, c.company_name
         FROM applications a
         JOIN jobs j ON a.job_id = j.id
         JOIN users c ON j.company_id = c.id
         WHERE a.user_id = ?
         ORDER BY a.applied_at DESC`,
        [jobseekerId],
      )
      return rows.map((row) => new Application(row))
    } catch (error) {
      console.error("Error finding applications by jobseeker:", error)
      return []
    }
  }

  static async updateStatus(id, status) {
    try {
      const [result] = await db.execute("UPDATE applications SET status = ? WHERE id = ?", [status, id])
      return result.affectedRows > 0
    } catch (error) {
      console.error("Error updating application status:", error)
      return false
    }
  }
}

module.exports = Application
