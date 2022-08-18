const knex = require('../database/knex')
const AppError = require('../utils/AppError')

class MovieTagsController {
  async index(request, response) {
    const { user_id } = request.query

    // Verify if user exists
    const user = await knex("users").where({ id: user_id })

    if(!user) {
      throw new AppError('Usuário não existe')
    }

    const tags = await knex("movie_tags").where({ user_id }).orderBy("name")

    return response.status(200).json(tags)
  }
}

module.exports = MovieTagsController