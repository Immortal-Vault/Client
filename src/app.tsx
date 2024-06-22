import { createTheme, MantineProvider } from '@mantine/core'
import Main from './main'

const theme = createTheme({})

export default function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme={'dark'}>
      <Main />
    </MantineProvider>
  )
}
