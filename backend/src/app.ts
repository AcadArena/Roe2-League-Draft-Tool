import express from "express"
import http from "http"
import { resolve as resolvePath } from "path"

import isAdmin from "is-win32-admin"
import minimist from "minimist"
import { AddressInfo } from "net"
import "./Console"
import { getDataProvider } from "./data/DataProviderService"
import DataDragon from "./data/league/DataDragon"
import GlobalContext from "./GlobalContext"
import logger, { setLogLevel } from "./logging"
import State from "./state"
import Controller from "./state/Controller"
import TickManager from "./TickManager"
import WebSocketServer from "./websocket"

const argv = minimist(process.argv.slice(2))
// Needs to be done before logging is initialized, in order to set log level correctly
GlobalContext.commandLine = {
  data: argv["data"],
  record: argv["record"],
  leaguePath: argv["leaguePath"] || "",
  experimentalConnector: argv["experimentalConnector"],
  debug: argv["debug"],
}
if (GlobalContext.commandLine.debug) {
  setLogLevel("debug")
}

const log = logger("main")
const app = express()

log.info("    _                 _    _                                    ")
log.info("   / \\   ___ __ _  __| |  / \\   _ __ ___ _ __   __ _            ")
log.info("  / _ \\ / __/ _` |/ _` | / _ \\ | '__/ _ \\ '_ \\ / _` |           ")
log.info(" / ___ \\ (_| (_| | (_| |/ ___ \\| | |  __/ | | | (_| |           ")
log.info(
  "/_/   \\_\\___\\__,_|\\__,_/_/   \\_\\_|  \\___|_| |_|\\__,_|           "
)
log.info(" _          _       ____             __ _     _____           _ ")
log.info("| |    ___ | |     |  _ \\ _ __ __ _ / _| |_  |_   _|__   ___ | |")
log.info("| |   / _ \\| |     | | | | '__/ _` | |_| __|   | |/ _ \\ / _ \\| |")
log.info("| |__| (_) | |___  | |_| | | | (_| |  _| |_    | | (_) | (_) | |")
log.info(
  "|_____\\___/|_____| |____/|_|  \\__,_|_|  \\__|   |_|\\___/ \\___/|_|"
)
log.info("")

log.debug("Logging in debug mode!")
log.info("Configuration: " + JSON.stringify(GlobalContext.commandLine))

const state = new State()
const ddragon = new DataDragon(state)
const dataProvider = getDataProvider()
const controller = new Controller({ dataProvider, state, ddragon })
const tickManager = new TickManager({ controller })

const server = http.createServer(app)
app.get("/image", (req, res) => {
  res.sendFile(resolvePath(__dirname, `../${req.query.path}`))
})

app.use("/cache", express.static(__dirname + "/../cache"))
export const wsServer = new WebSocketServer(server, state)

const main = async (): Promise<void> => {
  const admin = await isAdmin()
  if (!admin) {
    for (let i = 0; i < 5; i++) {
      log.error("⚠️ ADMIN PRIVILEGES REQUIRED.")
    }
  }
  await ddragon.init()

  wsServer.startHeartbeat()

  tickManager.startLoop()

  server.listen(process.env.PORT || 8999, () => {
    if (server.address() === null) {
      return log.error("Failed to start server.")
    }
    const serverAddress = server.address() as AddressInfo
    return log.info(`Server started on ${JSON.stringify(serverAddress)}`)
  })
}

main().then()
