const { Router } = require('express')
const MovieTagsController = require('../Controllers/MovieTagsController')

const movieTagsRoutes = Router()
const movieTagsController = new MovieTagsController();

movieTagsRoutes.get("/", movieTagsController.index)

module.exports = movieTagsRoutes