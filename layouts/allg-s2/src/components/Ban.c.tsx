import { Box, BoxProps } from "@mantine/core"
import type { Ban } from "../types/dto"
interface Props extends BoxProps {
  ban: Ban
}
const BanComponent = ({ ban, ...props }: Props) => {
  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        width: 63,
        height: 63,
        ...props.sx,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 63,
          height: 63,
          backgroundImage: `url("http://${window.location.hostname}:8999/image?path=${ban.champion.squareImg}")`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          // boxShadow: ban.isActive ? "inset 0 0 100px #004fff" : "none",
          filter:
            ban.isActive && ban.champion.id
              ? "brightness(0.5)"
              : "brightness(1)",
          zIndex: 2,
        }}
      ></Box>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 63,
          height: 63,
          animation: ban.isActive
            ? "fade 1s ease-in-out infinite alternate"
            : ban.champion.id
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
      ></Box>
    </Box>
  )
}

export default BanComponent
