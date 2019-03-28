import { Router } from 'express'
import auth from './authentication'
import bots from './bots'

import { verifyToken } from '../controllers/authController'

const routes = Router()

routes.use(verifyToken)

//page index 
routes.get('/', (req, res) => res.status(200).json('Api Server'))
routes.use('/auth', auth)
routes.use('/bots', bots)



routes.use((err, req, res, next) => {
  if (err.name !== 'HttpError' || !err.errorCode) return next(err)
  res.status(err.errorCode).json({ message: err.message })
})

export default routes