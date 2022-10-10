import { Box, Group, Stack, Text } from "@mantine/core"
import type { Pick } from "../types/dto"
import getImagePath from "../utils/getImagePath"
interface Props {
  pick: Pick
}
const PickComponent = ({ pick }: Props) => {
  const isFinalized = pick.champion.id && !pick.isActive
  return (
    <Box
      sx={{ position: "relative", overflow: "hidden", width: 164, height: 315 }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 164,
          height: 315,
          backgroundImage: getImagePath(pick.champion.splashCenteredImg),
          backgroundPosition: "center",
          backgroundSize: "cover",
          // boxShadow: pick.isActive ? "inset 0 0 100px #004fff" : "none",
          filter:
            pick.isActive && pick.champion.id
              ? "brightness(0.5)"
              : "brightness(1)",
          zIndex: 2,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 164,
          height: 315,
          animation: pick.isActive
            ? "fade 1s ease-in-out infinite alternate"
            : pick.champion.id
            ? "flash 1000ms ease-out"
            : "none",

          "@keyframes fade": {
            from: { boxShadow: "inset 0 0 50px #004fff" },
            to: { boxShadow: "inset 0 0 0px #004fff" },
          },

          "@keyframes flash": {
            from: { boxShadow: "inset 0 0 100px #fff" },
            to: { boxShadow: "inset 0 0 0px #004fff" },
          },
          zIndex: 3,
        }}
      />
      <Stack
        sx={{
          width: "100%",
          position: "absolute",
          bottom: 20,
          zIndex: 10,
          flexDirection: "column-reverse",
          transform: isFinalized ? "translateY(0px)" : "translateY(60px)",
          transition: "all 300ms ease-out",
        }}
        align="center"
        spacing={isFinalized ? "xs" : 30}
      >
        <Group noWrap position="center">
          <Box
            sx={{
              boxShadow: "0px 8px 8px rgba(0,0,0,.5)",
              borderRadius: 7,
              height: 40,
              width: 40,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundImage: getImagePath(pick.spell1.icon),
            }}
          />
          <Box
            sx={{
              boxShadow: "0px 8px 8px rgba(0,0,0,.5)",
              borderRadius: 7,
              height: 40,
              width: 40,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundImage: getImagePath(pick.spell2.icon),
            }}
          />
        </Group>
        <Text
          align="center"
          color="#fff"
          size="xl"
          sx={{
            overflow: "visible",
            textShadow: "0px 8px 8px rgba(0,0,0,1)",
            fontFamily: "Subway",
            letterSpacing: 2,
          }}
          lineClamp={1}
        >
          {pick.displayName}
        </Text>
      </Stack>
    </Box>
  )
}

export default PickComponent
