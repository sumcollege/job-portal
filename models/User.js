const db = require("../config/database")
const bcrypt = require("bcryptjs")

class User {
  constructor(data) {
    this.id = data.id
    this.name = data.name
    this.email = data.email
    this.password = data.password
    this.role = data.role
    this.phone = data.phone
    this.address = data.address
    this.company_name = data.company_name
    this.company_description = data.company_description
    this.created_at = data.created_at
    this.updated_at = data.updated_at
  }

  static async create(userData) {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10)
      const [result] = await db.execute(
        "INSERT INTO users (name, email, password, role, phone, address, company_name, company_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          userData.name,
          userData.email,
          hashedPassword,
          userData.role,
          userData.phone || null,
          userData.address || null,
          userData.company_name || null,
          userData.company_description || null,
        ],
      )
      return result.insertId
    } catch (error) {
      console.error("Error creating user:", error)
      throw error
    }
  }

  static async findByEmail(email) {
    try {
      const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email])
      return rows.length > 0 ? new User(rows[0]) : null
    } catch (error) {
      console.error("Error finding user by email:", error)
      throw error
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [id])
      return rows.length > 0 ? new User(rows[0]) : null
    } catch (error) {
      console.error("Error finding user by ID:", error)
      throw error
    }
  }

  async validatePassword(password) {
    try {
      return await bcrypt.compare(password, this.password)
    } catch (error) {
      console.error("Error validating password:", error)
      return false
    }
  }

  static async getAllCompanies() {
    try {
      const [rows] = await db.execute('SELECT * FROM users WHERE role = "company"')
      return rows.map((row) => new User(row))
    } catch (error) {
      console.error("Error getting all companies:", error)
      throw error
    }
  }
}

module.exports = User
