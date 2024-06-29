import {
  Anchor,
  Button,
  Container,
  Group,
  LoadingOverlay,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { useNavigate } from 'react-router-dom'
import { ROUTER_PATH } from './shared/constants'
import { AuthContext } from './stores/Auth/AuthContext'
import { useContext } from 'react'

export default function SignIn() {
  const navigate = useNavigate()
  const { setAuthState } = useContext(AuthContext)
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
  })
  const [loaderVisible, setLoaderState] = useDisclosure(false)

  const signInAccount = async () => {
    setLoaderState.open()
    const email = form.values.email
    const password = form.values.password

    let response

    try {
      response = await fetch(`${process.env.API_SERVER_URL}/signIn`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
    } catch (error) {
      new window.Notification('Sign In', {
        body: 'Immortal Vault server is down, please try again later',
      })
      setLoaderState.close()
      return
    }

    if (!response.ok) {
      switch (response.status) {
        case 404: {
          new window.Notification('Sign In', { body: `User ${email} was not found` })
          setLoaderState.close()
          return
        }
        case 409: {
          new window.Notification('Sign In', { body: 'Incorrect password' })
          setLoaderState.close()
          return
        }
        default: {
          new window.Notification('Sign In', { body: `Failed with: ${await response.text()}` })
          setLoaderState.close()
          return
        }
      }
    }

    const jwtToken = (await response.json()).token
    localStorage.setItem('jwtToken', jwtToken)

    new window.Notification('Sign In', { body: 'Successful' })
    setAuthState(true)
    setLoaderState.close()

    // redirect to main after sign In
    navigate(ROUTER_PATH.MAIN_MENU)
  }

  return (
    <div
      style={{
        marginTop: '20%',
      }}
    >
      <Container size={460} my={40}>
        <LoadingOverlay
          visible={loaderVisible}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'orange' }}
        />
        <Title order={1} ta='center'>
          {'Sign In'}
        </Title>
        <Title order={2} ta='center' mb={'xl'}>
          {'Log into your account'}
        </Title>

        <form onSubmit={form.onSubmit(signInAccount)}>
          <Stack>
            <TextInput
              required
              label={'Email'}
              placeholder={'JohnDoe@gmail.com'}
              value={form.values.email}
              onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
              error={form.errors.email && 'fields.email.invalid'}
              radius='md'
            />

            <PasswordInput
              required
              label={'Password'}
              value={form.values.password}
              onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
              radius='md'
            />
          </Stack>

          <Group justify='space-between' mt='xl'>
            <Anchor
              component='button'
              type='button'
              c='dimmed'
              size='xs'
              onClick={() => navigate(ROUTER_PATH.SIGN_UP)}
            >
              {'Do not have account? Sign Up'}
            </Anchor>
            <Button type='submit' radius='xl'>
              {'Sign In'}
            </Button>
          </Group>
        </form>
      </Container>
    </div>
  )
}
