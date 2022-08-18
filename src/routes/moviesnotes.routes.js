const { Router } = require('express')
const MovieNotesController = require('../Controllers/MoviesNotesController')

const moviesNotesRoutes = Router()
const movieNotesController = new MovieNotesController()

moviesNotesRoutes.get("/", movieNotesController.index)
moviesNotesRoutes.get("/:id", movieNotesController.show)
moviesNotesRoutes.post("/:user_id", movieNotesController.create)
moviesNotesRoutes.put("/:id", movieNotesController.update)
moviesNotesRoutes.delete("/:id", movieNotesController.delete)

module.exports = moviesNotesRoutes