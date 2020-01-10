import express from 'express'
import bodyParser from 'body-parser'

import controllers from './app/controllers/index'

const PORT = 3000
const app = express()

app.get(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

controllers(app)

app.listen(PORT)