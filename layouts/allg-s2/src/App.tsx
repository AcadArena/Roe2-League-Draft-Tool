import { useState } from "react"
import "./App.css"
import { useStateData } from "./redux/redux.hook"

function App() {
  const state = useStateData()
  const [count, setCount] = useState(0)

  return <div>{JSON.stringify(state)}</div>
}

export default App
