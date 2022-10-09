import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { StateData } from "../types/dto"

const initialState: StateData = new StateData()

export type StatePayload = { state: Partial<StateData> }
type Action = PayloadAction<StatePayload>
export const stateSlice = createSlice({
  name: "state",
  initialState,
  reducers: {
    set: (state, action: Action) => {
      return { ...state, ...action.payload.state }
    },
  },
})

export const { set: setState } = stateSlice.actions
export default stateSlice.reducer
