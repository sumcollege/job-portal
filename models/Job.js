const db = require("../config/database")

class Job {
  constructor(data) {
    this.id = data.id
    this.title = data.title
    this.description = data.description
    this.requirements = data.requirements
    this.salary_range = data.salary_range
    this.location = data.location
    this.job_type = data.job_type
    this.company_id = data.company_id
    this.status = data.status
    this.created_at = data.created_at
    this.updated_at = data.updated_at
    this.company_name = data.company_name
    this.company_description = data.company_description
  }

  static async create(jobData) {
    try {
      const [result] = await db.execute(
        "INSERT INTO jobs (title, description, requirements, salary_range, location, job_type, company_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          jobData.title,
          jobData.description,
          jobData.requirements || null,
          jobData.salary_range || null,
          jobData.location,
          jobData.job_type,
          jobData.company_id,
        ],
      )
      return result.insertId
    } catch (error) {
      console.error("Error creating job:", error)
      throw error
    }
  }

  static async findAll(limit = 10, offset = 0) {
    try {
      const [rows] = await db.execute(
        `SELECT j.*, u.company_name, u.company_description
         FROM jobs j 
         JOIN users u ON j.company_id = u.id 
         WHERE j.status = 'active' 
         ORDER BY j.created_at DESC 
         LIMIT ? OFFSET ?`,
        [Number.parseInt(limit), Number.parseInt(offset)],
      )
      return rows.map((row) => new Job(row))
    } catch (error) {
      console.error("Error finding all jobs:", error)
      throw error
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.execute(
        `SELECT j.*, u.company_name, u.company_description 
         FROM jobs j 
         JOIN users u ON j.company_id = u.id 
         WHERE j.id = ?`,
        [id],
      )
      return rows.length > 0 ? new Job(rows[0]) : null
    } catch (error) {
      console.error("Error finding job by ID:", error)
      throw error
    }
  }

  static async findByCompanyId(companyId) {
    try {
      const [rows] = await db.execute("SELECT * FROM jobs WHERE company_id = ? ORDER BY created_at DESC", [companyId])
      return rows.map((row) => new Job(row))
    } catch (error) {
      console.error("Error finding jobs by company ID:", error)
      throw error
    }
  }

  static async update(id, jobData) {
    try {
      const [result] = await db.execute(
        "UPDATE jobs SET title = ?, description = ?, requirements = ?, salary_range = ?, location = ?, job_type = ? WHERE id = ?",
        [
          jobData.title,
          jobData.description,
          jobData.requirements || null,
          jobData.salary_range || null,
          jobData.location,
          jobData.job_type,
          id,
        ],
      )
      return result.affectedRows > 0
    } catch (error) {
      console.error("Error updating job:", error)
      throw error
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.execute("DELETE FROM jobs WHERE id = ?", [id])
      return result.affectedRows > 0
    } catch (error) {
      console.error("Error deleting job:", error)
      throw error
    }
  }

  static async getTotalCount() {
    try {
      const [rows] = await db.execute('SELECT COUNT(*) as count FROM jobs WHERE status = "active"')
      return rows[0].count
    } catch (error) {
      console.error("Error getting total job count:", error)
      return 0
    }
  }
}

module.exports = Job
