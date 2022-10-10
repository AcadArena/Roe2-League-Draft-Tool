import { Group, Stack } from "@mantine/core"
import { Ban, Team } from "../types/dto"
import BanComponent from "./Ban.c"
import PickComponent from "./Pick.c"

interface Props {
  team: Team
  side?: "left" | "right"
}

const TeamComponent = ({ team, side = "left" }: Props) => {
  const bans =
    team.bans.length < 5
      ? [...team.bans, ...new Array(5 - team.bans.length).fill(new Ban())]
      : team.bans
  return (
    <Stack spacing={20} align={side === "left" ? "flex-end" : "flex-start"}>
      <Group
        spacing={7}
        noWrap
        sx={{ flexDirection: side === "left" ? "row" : "row-reverse" }}
      >
        {bans.map((ban, index) => (
          <BanComponent
            key={index}
            sx={{
              marginLeft: side === "left" && index === 3 ? 34 : 0,
              marginRight: side === "right" && index === 3 ? 34 : 0,
            }}
            ban={ban}
          />
        ))}
      </Group>
      <Group mb={37} spacing={7} noWrap>
        {team.picks.map((pick, index) => (
          <PickComponent key={index} pick={pick} />
        ))}
      </Group>
    </Stack>
  )
}

export default TeamComponent
