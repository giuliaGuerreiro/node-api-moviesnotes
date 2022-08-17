class UsersController {
  
  create(request, response) {
    const { name, email, password } = request.body

    return response.status(201).json({ name, email, password })
  }
}

module.exports = UsersController