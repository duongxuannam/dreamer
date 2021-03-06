import SocketIO from 'socket.io'
import jwt from 'jsonwebtoken'

import logger from '../utils/logger'
import configs from '../configs'
import ServerError from '../utils/serverError'
import { ROLES } from '../utils/constants'
import { findIndex as loFindIndex, remove as loRemove } from 'lodash'
import { EVENT_SOCKET } from '../utils/constants'

class _SocketService {

  constructor() {
    this.io = null
    this.connections = {}

    this.onConnection = this.onConnection.bind(this)
  }

  start(server) {
    this.io = new SocketIO(server)

    // middleware
    this.io.use(async (socket, next) => {
      try {
        const authorization = socket.handshake.query.accessToken
        if (!authorization) throw new ServerError('Missing token', 401)

        const token = authorization.split(' ')[1]
        const payload = await new Promise((resolve, reject) => (
          jwt.verify(token, configs.JWT_SECRET_TOKEN, function (err, payload) {
            if (err) return reject(err)
            resolve(payload)
          })
        ))

        socket.user = payload.user
        if (!socket.user) throw new ServerError('Please login to continue', 401)

        if (socket.user.role !== ROLES.MASTER_ADMIN
          && socket.user.role !== ROLES.ADMIN
          && socket.user.role !== ROLES.USER) throw new ServerError('Access denied', 403)

        return next()
      } catch (error) {
        next(error)
      }
    })

    this.io.on('connection', this.onConnection)
  }

  close() {
    this.io && this.io.close()
  }

  onConnection(socket) {
    if (!this.connections) this.connections = {}
    const clinicId = socket.user.clinicId
    const userId = socket.user._id

    if (this.connections[clinicId]) {
      const indexConnections = loFindIndex(this.connections[clinicId],
        item => item.userId === userId)

      const { role } = socket.user

      if (indexConnections < 0) {
        this.connections[clinicId].push(
          {
            userId,
            role,
            socketIds: [socket.id],
          }
        )
      } else {
        (this.connections[clinicId])[indexConnections]
          .socketIds
          .push(socket.id)
      }
    } else {
      this.connections[clinicId] = [{
        userId: socket.user._id,
        role: socket.user.role,
        socketIds: [socket.id],
      }]
    }

    socket.on(EVENT_SOCKET.DISCONNECT, (reason) => {
      const indexConnections = loFindIndex(this.connections[clinicId],
        item => item.userId === userId)
      if (indexConnections >= 0) {
        //loRemove socketId disconnect in array socketIds of user
        loRemove(
          (this.connections[clinicId])[indexConnections].socketIds,
          item => item === socket.id
        )

        // If array socketIds empty loRemove user from array connections of clinic
        if ((this.connections[clinicId])[indexConnections].socketIds.length === 0) {
          this.connections[clinicId].splice(indexConnections, 1)

          if (this.connections[clinicId].length === 0) delete this.connections[clinicId]
        }
      }
      logger.warning(reason)
    })

    socket.on(EVENT_SOCKET.ERROR, (error) => {
      logger.error(error)
    })
  }

  getIO() { return this.io }

  getConnections() { return this.connections }

}

const SocketService = new _SocketService()

export default SocketService