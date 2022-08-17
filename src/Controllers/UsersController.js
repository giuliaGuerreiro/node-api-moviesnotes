const AppError = require('../utils/AppError')

class UsersController {
  
  create(request, response) {
    const { name, email, password } = request.body

    if(!email || !password) {
      throw new AppError('Email e senha são obrigatórios')
    }

    return response.status(201).json({ name, email, password })
  }
}

module.exports = UsersController