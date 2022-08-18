const { Router } = require('express')
const MovieNotesController = require('../Controllers/MoviesNotesController')

const moviesNotesRoutes = Router()
const movieNotesController = new MovieNotesController()

moviesNotesRoutes.post("/:user_id", movieNotesController.create)
moviesNotesRoutes.put("/:id", movieNotesController.update)

module.exports = moviesNotesRoutes