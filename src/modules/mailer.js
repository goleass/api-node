import path from 'path'
import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'

import { host, port, user, pass } from '../config/mail.json'

const transport = nodemailer.createTransport({
  host,
  port,
  auth: { user, pass }
});

module.exports = transport