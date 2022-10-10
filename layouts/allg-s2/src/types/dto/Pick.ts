import { Actionable, Champion, Spell } from "./"

export class Pick implements Actionable {
  id: number
  spell1 = new Spell()
  spell2 = new Spell()
  champion = new Champion()
  isActive = false
  displayName = ""
  constructor(id: number) {
    this.id = id
  }
}
