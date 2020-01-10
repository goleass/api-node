import authConfig from '../../config/auth'
import jwt, { decode } from 'jsonwebtoken'

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) return res.status(401).send({ error: "No token provided" })

  const parts = authHeader.split(' ')

  if (!parts.length === 2) return res.status(401).send({ error: "Token error" })

  const [scheme, token] = parts  // Barer s456fs1d56s4d46csdc6846

  if (!/^Barer$/i.test(scheme)) return res.status(401).send({ error: "Token malformatted" })

  jwt.verify(token, authConfig.secret, (err, decoded) => {

    if (err) return res.status(401).send({ error: "Token invalid" })

    req.userId = decoded.id
    req.email = decoded.email

    return next()
  })
}