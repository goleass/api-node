import express from 'express'
import { Router as expressRouter } from 'express';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import cripto from 'crypto'

import remetente from '../../modules/mailer'
import authConfig from '../../config/auth'
import User from '../../app/models/user'

const router = expressRouter();

function genereteToke(params = {}){
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400
    })

    // sing: 1 ( chave única entre usuários ), 2 ( chave única para a aplicação ) e 3 ( o tempo em que irá expirar )
}

router.post('/register', async (req, res) => {
    const { email } = req.body

    try {
        if (await User.findOne({ email }))
            return res.status(400).send({ error: 'User already exists' })

        const user = await User.create(req.body)

        user.password = undefined

        return res.send({ 
            user, 
            token: genereteToke({ id: user.id }) 
        })

    } catch (err) {
        return res.status(400).send({ error: 'Registration failed', err })
    }
})

router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')

    if (!user)
        return res.status(400).send({ error: 'User not found' })

    if (!await bcrypt.compare(password, user.password)) {
        console.log(email, password)
        return res.status(400).send({ error: 'Invalid password' })
    }

    user.password = undefined // remove o password para não aparecer na resposta

    res.send({ 
        user, 
        token: genereteToke({ id: user.id, email: user.email }) 
    })

})

router.post('/forgot_password', async (req, res) => {
    const { email } = req.body
    
    try {
        const user = await User.findOne({ email })

        if(!user) return res.status(400).send({ error: 'User not found' })

        const token = cripto.randomBytes(20).toString('hex')
        const now = new Date()
        now.setHours(now.getHours()+1)
        
        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now
            }
        })

        const emailASerEnviado = {
            from: 'leonardo.assuncao@zanc.com.br',
            to: email,
            text: 'Você esqueceu sua senha? Sem problemas, use esse token: '+token
            }
        
        remetente.sendMail(emailASerEnviado, function(error){
            if (error) {
            return res.status(400).send({ error: 'erro' }); console.log(error);
            } else {
            return res.send(); console.log('Email enviado com sucesso.');
            }
            });

    } catch (error) { 
        res.status(400).send({ error: 'Erro on forgot password, try again' })
    }

})

router.post('/reset_password', async (req, res) => {
    const { email, token, password } = req.body

    try{
        const user = await User.findOne({ email })
            .select('+passwordResetToken passwordResetExpires')

        if(!user) return res.status(400).send({ error: 'User not found' })

        if(user.passwordResetToken !== token) return res.status(400).send({ error: 'Token invalid', token })

        const now = new Date()

        if(now > user.passwordResetExpires) return res.status(400).send({ error: 'Token expired, generate a new one' })

        user.password = password

        await user.save()

        res.send()
    }
    catch (err){
        res.send(400).send({ error: 'Cannot reset password, try again' })
    }
    
})

module.exports = app => app.use('/auth', router)  // exportando uma funcao 

















