const knex = require('../database/knex')
const AppError = require('../utils/AppError')

class MovieNotesController {
  async create(request, response) {
    const { title, description, rating, tags } = request.body
    const { user_id } = request.params

    // Verify if user exists
    const user = await knex("users").where({ id: user_id }).first()

    if(!user) {
      throw new AppError('Usuário não existe')
    }

    // Verify if title and rating is set
    if(!title || !rating) {
      throw new AppError('Título e nota são obrigatórios')
    }

    // Verify if rating between 1 and 5
    const validRating = rating >= 1 && rating <= 5
    if(!validRating) {
      throw new AppError('A nota deve estar entre 1 e 5')
    }

    const note_id = await knex("movie_notes").insert({
      title,
      description,
      rating,
      user_id
    })

    const insertTags =  tags.map( name => {
      return {
        name,
        note_id,
        user_id
      }
    })

    await knex("movie_tags").insert(insertTags)

    return response.status(201).json()
  }

  async update(request, response) {
    const { id } = request.params
    const { title, description, rating } = request.body

    // Verify if note exists
    const movieNote = await knex("movie_notes").where({ id }).first()
    console.log(movieNote)
    if(!movieNote) {
      throw new AppError('Nota não existe')
    }

    await knex("movie_notes").where({ id }).update({title, description, rating})

    return response.status(200).json()
  }
}

module.exports = MovieNotesController