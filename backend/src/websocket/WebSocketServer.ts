import * as fs from "fs"
import * as http from "http"

import logger from "../logging"
import State from "../state"
import { Config, StateData } from "../types/dto"
import ChampSelectEndedEvent from "../types/events/ChampSelectEndedEvent"
import ChampSelectStartedEvent from "../types/events/ChampSelectStartedEvent"
import NewActionEvent from "../types/events/NewActionEvent"
import NewStateEvent from "../types/events/NewStateEvent"
import PBEvent from "../types/events/PBEvent"

import io, { Server, Socket } from "socket.io"

const log = logger("websocket")

class WebSocketServer {
  server: Server
  state: State
  exampleClients: Array<WebSocket> = []
  heartbeatInterval?: NodeJS.Timeout
  config = new Config()

  constructor(server: http.Server, state: State) {
    this.server = new io.Server(server, { cors: { origin: "*" } })
    this.state = state

    this.sendHeartbeat = this.sendHeartbeat.bind(this)

    // Event listeners
    this.server.on("connection", (socket) => {
      this.handleConnection(socket)
    })

    state.on("stateUpdate", (newState: StateData) => {
      newState.config = this.config
      this.sendEvent(new NewStateEvent(newState))
    })
    state.on("champSelectStarted", () =>
      this.sendEvent(new ChampSelectStartedEvent())
    )
    state.on("champSelectEnded", () =>
      this.sendEvent(new ChampSelectEndedEvent())
    )
    state.on("newAction", (action) => {
      this.sendEvent(new NewActionEvent(action))
    })
  }

  parse<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj)) as T
  }

  startHeartbeat(): void {
    this.heartbeatInterval = setInterval(this.sendHeartbeat, 1000)
  }

  handleConnection(socket: Socket): void {
    socket.emit("newState", { state: this.state.data })
  }

  sendEvent(event: PBEvent): void {
    const serializedEvent = this.parse(event)
    log.debug(`New Event: ${serializedEvent}`)

    const { eventType, ...data } = serializedEvent
    this.server.emit(eventType, data)
  }

  sendHeartbeat(): void {
    this.config = JSON.parse(fs.readFileSync("./config.json", "utf8"))
    this.server.emit("heartbeat", this.config)
  }
}

export default WebSocketServer
