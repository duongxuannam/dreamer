import { Router } from 'express'

import * as authController from '../controllers/authController'

const routes = Router()

routes.post('/login', authController.login)
export default routes