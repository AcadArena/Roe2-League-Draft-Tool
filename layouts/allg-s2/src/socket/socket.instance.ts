import { io } from "socket.io-client"
import { globalDispatch, setState, StatePayload } from "../redux"

const URL = `${window.location.hostname}:8999`

export const socket = io(URL)

socket.on("newState", (newState: StatePayload) => {
  globalDispatch(setState(newState))
})
