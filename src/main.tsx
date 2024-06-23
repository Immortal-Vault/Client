import { useState } from 'react'
import { Center, Container, Flex, Loader, Title } from '@mantine/core'

export default function Main() {
  const [serverState, setServerState] = useState(false)

  setInterval(async () => {
    try {
      await fetch('http://localhost:3001/ping', {
        method: 'GET',
      })

      setServerState(true)
    } catch {
      setServerState(false)
    }
  }, 50)

  return (
    <Container>
      <Center>
        <Flex direction={'column'} align={'center'} gap={'1rem'}>
          <Title order={1}>Server is {serverState ? 'up2date' : 'down'}</Title>
          {!serverState && <Loader color='blue' />}
        </Flex>
      </Center>
    </Container>
  )
}
