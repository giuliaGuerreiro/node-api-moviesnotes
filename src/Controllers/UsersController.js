const sqliteConnection = require('../database/sqlite')
const AppError = require('../utils/AppError')
const { hash, compare } = require('bcryptjs')

class UsersController {
  
  async create(request, response) {
    const { name, email, password } = request.body

    if(!email || !password) {
      throw new AppError('Email e senha são obrigatórios')
    }

    const database = await sqliteConnection()

    // Verify if email is already used
    const emailExists = await database.get("SELECT * FROM users WHERE email = ?", [email])
    if(emailExists) {
      throw new AppError('Este email já está em uso')
    }

    const hashedPassword = await hash(password, 8)

    await database.run(`
    INSERT INTO users
    (name, email, password)
    VALUES
    (?, ?, ?)
    `, [name, email, hashedPassword])

    return response.status(201).json()
  }
}

module.exports = UsersController