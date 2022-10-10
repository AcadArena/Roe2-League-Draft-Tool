import { Group } from "@mantine/core"
import { useStateData } from "../redux/redux.hook"
import commonCss from "../utils/commonCss"
import TeamComponent from "./Team.c"

const DraftComponent = () => {
  const state = useStateData()
  return (
    <Group
      noWrap
      spacing={127}
      align="end"
      position="center"
      sx={{
        ...commonCss,
        zIndex: 2,
      }}
    >
      <TeamComponent team={state.blueTeam} side="left" />
      <TeamComponent team={state.redTeam} side="right" />
    </Group>
  )
}

export default DraftComponent
