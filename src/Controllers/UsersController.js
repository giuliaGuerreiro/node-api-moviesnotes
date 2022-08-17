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

  async update(request, response) {
    const { name, email, password, old_password } = request.body
    const { id } = request.params

    const database = await sqliteConnection()

    // verify if user exists
    const user = await database.get("SELECT * FROM users WHERE id = ?", [id])
    if(!user) {
      throw new AppError('Usuário não existe')
    }

    // Verify if email exists in another user
    const userEmail = await database.get("SELECT * FROM users WHERE email = ?", [email])
    if(userEmail && userEmail.id !== user.id) {
      throw new AppError('O email já está em uso.')
    }

    user.name = name ?? user.name
    user.email = email ?? user.email

    if(password && !old_password) {
      throw new AppError('A senha antiga é necessária para definir a nova senha')
    }

    if(password && old_password) {
      // Verify if old password is correct
      const checkOldPassword = await compare(old_password, user.password)
      if(!checkOldPassword) {
        throw new AppError('Senha antiga não confere')
      }

      user.password = await hash(password, 8)
    }

    await database.run(`
    UPDATE users SET
    name = ?,
    email = ?,
    password = ?,
    updated_at = DATETIME('now')
    WHERE id = ?
    `, [user.name, user.email, user.password, id])

    return response.status(200).json()
  }

  async delete(request, response) {
    const { id } = request.params

    const database = await sqliteConnection()

    // Verify if user exists
    const user = await database.get("SELECT * FROM users WHERE id = ?", [id])
    if(!user) {
      throw new AppError('Usuário não existe')
    }

    await database.run(`
    DELETE FROM users
    WHERE id = ?
    `, [id])

    return response.status(200).json()
  }
}

module.exports = UsersController