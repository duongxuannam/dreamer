import { Router } from 'express'
import * as botsController from '../controllers/botsController'

const routes = Router()

routes.get('/', botsController.getAll)

routes.get('/count', botsController.countAll)

routes.post('/start', botsController.start)

routes.post('/stop', botsController.stop)

routes.post('/toggle', botsController.toggle)

routes.get('/startLienMinh360', botsController.startLienMinh360)

export default routes