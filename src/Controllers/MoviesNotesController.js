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

    if(!movieNote) {
      throw new AppError('Nota não existe')
    }

    await knex("movie_notes").where({ id }).update({title, description, rating})

    return response.status(200).json()
  }

  async delete(request, response) {
    const { id } = request.params

    // Verify if note exists
    const noteExists = await knex("movie_notes").where({ id }).first()

    if(!noteExists) {
      throw new AppError('Nota não existe')
    }

    await knex("movie_notes").where({ id }).delete()

    return response.status(200).json()
  }

  async show(request, response) {
    const { id } = request.params

    // Verify if note exists
    const noteExists = await knex("movie_notes").where({ id }).first()

    if(!noteExists) {
      throw new AppError('Nota não existe')
    }

    // Inlude tags
    const noteTags = await knex("movie_tags").where({ note_id: id }).orderBy("name")

    const noteWithTags = {
      ...noteExists,
      tags: noteTags
    };

    return response.status(200).json(noteWithTags)
  }

  async index(request, response) {
    const { user_id, title, tags } = request.query

    // Verify if user exists
    const user = await knex("users").where({ id: user_id }).first()
    if(!user) {
      throw new AppError('Usuário não existe')
    }

    // Notes from user
    let notes;

    if(tags) {
      const tagsArray = tags.split(',')
      
      notes = await knex("movie_tags")
      .select([
        "movie_notes.id",
        "movie_notes.title",
        "movie_notes.description",
        "movie_notes.user_id"
      ])
      .whereIn("movie_tags.name", tagsArray)
      .where("movie_notes.user_id", user_id)
      .whereLike("movie_notes.title", `%${title}%`)
      .innerJoin("movie_notes", "movie_notes.id", "movie_tags.note_id")
      .orderBy("movie_notes.title")

    } else {
      notes = await knex("movie_notes")
      .where({ user_id })
      .whereLike("title", `%${title}%`)
      .orderBy("title")      
    }

    // Adding tags' notes
    const userTags = await knex("movie_tags").where({ user_id })
    const notesWithTags = notes.map( note => {
      const noteTags = userTags.filter( tag => tag.note_id === note.id )
      
      return {
        ...note,
        tags: noteTags
      }
    })

    return response.status(200).json(notesWithTags)
  }
}

module.exports = MovieNotesController