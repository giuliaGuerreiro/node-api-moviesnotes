const { Router } = require('express')
const UsersController = require('../Controllers/UsersController')

const userRoutes = Router()
const usersController = new UsersController()

function myMiddleware(request, response, next) {
  const { isAdmin, email } = request.body

  if(!isAdmin) {
    return response.status(401).json({message: `Usuário ${email} não autorizado`})
  }

  next()
}

userRoutes.post("/", myMiddleware, usersController.create)

module.exports = userRoutes