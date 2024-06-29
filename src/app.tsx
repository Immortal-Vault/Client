import { createTheme, MantineProvider } from '@mantine/core'
import SignUp from './SignUp'
import Update from './Update'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { ROUTER_PATH } from './shared/constants'
import SignIn from './SignIn'
import Main from './Main'

const theme = createTheme({})

export default function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme={'dark'}>
      <HashRouter>
        <Routes>
          <Route path={ROUTER_PATH.ROOT} element={<SignUp />} />
          <Route path={ROUTER_PATH.SIGN_IN} element={<SignIn />} />
          <Route path={ROUTER_PATH.SIGN_UP} element={<SignUp />} />
          <Route path={ROUTER_PATH.MAIN_MENU} element={<Main />} />
        </Routes>
      </HashRouter>
      <Update />
    </MantineProvider>
  )
}
