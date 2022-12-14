import PBEvent from "./PBEvent"

export default class NewActionEvent implements PBEvent {
  constructor(action: unknown) {
    this.action = action
  }

  eventType = "newAction"
  action: unknown
}
