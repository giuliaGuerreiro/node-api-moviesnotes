const { Router } = require('express')
const userRoutes = require('./users.routes')
const moviesNotesRoutes = require('./moviesnotes.routes')
const movieTagsRoutes = require('./moviestags.routes')

const routes = Router()

routes.use("/users", userRoutes)
routes.use("/movies-notes", moviesNotesRoutes)
routes.use("/movie-tags", movieTagsRoutes)

module.exports = routes