import logger from "./logging/logger"
import Controller from "./state/Controller"
import Timeout = NodeJS.Timeout

const log = logger("tick")

class TickManager {
  controller: Controller
  timeout?: Timeout
  tickRate = 1
  interval = 1000

  constructor(kwargs: { controller: Controller }) {
    this.controller = kwargs.controller
  }

  startLoop(): void {
    log.info(`Starting main loop with ${1 / this.tickRate} ticks/s!`)
    this.timeout = setInterval(
      () => this.runLoop(),
      this.interval / this.tickRate
    )
  }

  async runLoop(): Promise<void> {
    const newState = await this.controller.dataProvider.getCurrentData()

    if (newState !== null) {
      this.controller.applyNewState(newState)
    }
  }
}

export default TickManager
