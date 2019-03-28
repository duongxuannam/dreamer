import logger from '../utils/logger'

const TIME_INTERVAL = 2 * 60 * 60 * 1000 // 2 hours

export default class BotCore {

  constructor(name) {
    this.name = name
    this.isRunning = false

    logger.info(`Create bot ${name}`)
  }

  toggle() {
    this.isRunning = !this.isRunning
    if (this.isRunning) {
      this.runTask()
      this.interval = setInterval(() => {
        this.runTask()
      }, TIME_INTERVAL)
    } else {
      clearInterval(this.interval)
    }
  }

  start() {
    if (this.isRunning) {
      logger.info(`Bot ${this.name} is running`)
    } else {
      this.isRunning = true
      this.runTask()
      this.interval = setInterval(() => {
        this.runTask()
      }, TIME_INTERVAL)
    }
  }

  stop() {
    this.isRunning = false
    clearInterval(this.interval)
  }

}