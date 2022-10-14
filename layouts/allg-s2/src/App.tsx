import { Box, MantineProvider } from "@mantine/core"
import back from "./assets/back.png"
import front from "./assets/front.png"
import DraftComponent from "./components/Draft.c"
import TimerComponent from "./components/Timer.c"
import { SubwayPropBerlin } from "./fonts/SubwayProBerlin/Subway.font"
import commonCss from "./utils/commonCss"

function App() {
  return (
    <MantineProvider withNormalizeCSS withGlobalStyles>
      <SubwayPropBerlin />
      <Box
        sx={{
          height: 1080,
          width: 1920,
          position: "relative",
        }}
      >
        <Box
          sx={{
            ...commonCss,
            height: 462,
            backgroundSize: "contain",
            backgroundImage: `url("${front}")`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            zIndex: 100,
          }}
        ></Box>
        <Box
          sx={{
            ...commonCss,
            height: 433,
            backgroundSize: "contain",
            backgroundImage: `url("${back}")`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            zIndex: 1,
          }}
        ></Box>
        <DraftComponent />
        <TimerComponent />
      </Box>
    </MantineProvider>
  )
}

export default App
