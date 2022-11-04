import Fastify from 'fastify'
import jwt from '@fastify/jwt'
import cors from '@fastify/cors'

import { pollRoutes } from './routes/poll'
import { userRoutes } from './routes/user'
import { gameRoutes } from './routes/game'
import { guessRoutes } from './routes/guess'
import { authRoutes } from './routes/auth'



async function bootstrap() {
  const fastify = Fastify({
    logger: true,
  })

  await fastify.register(cors, {
    origin: true,
  })

  await fastify.register(jwt, {
    secret: String(process.env.JWT_SECRET)
  })

  await fastify.register(pollRoutes)
  await fastify.register(userRoutes)
  await fastify.register(gameRoutes)
  await fastify.register(guessRoutes)
  await fastify.register(authRoutes)

  await fastify.listen({
    port: 3333,
    host: '0.0.0.0',
  })
}

bootstrap()