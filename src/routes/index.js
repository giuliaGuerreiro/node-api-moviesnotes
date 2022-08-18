const { Router } = require('express')
const userRoutes = require('./users.routes')
const moviesNotesRoutes = require('./moviesnotes.routes')

const routes = Router()

routes.use("/users", userRoutes)
routes.use("/movies-notes", moviesNotesRoutes)

module.exports = routes