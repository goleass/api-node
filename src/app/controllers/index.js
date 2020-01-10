import fs from 'fs'
import path from 'path';

// percorre cada arquivo dentro da pasta controllers e importa passando com parâmetro o 'app'

module.exports = app => {
  fs
    .readdirSync(__dirname)
    .filter(file => ((file.indexOf('.')) !== 0 && (file !== "index.js")))
    .forEach(file => require(path.resolve(__dirname, file))(app))
}