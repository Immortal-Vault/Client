import {
  Anchor,
  Button,
  Container,
  Flex,
  Group,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'

export default function Main() {
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      confirmPassword: '',
    },

    validate: {
      // username: (val) => (val.length < 4 ? 'fields.username.tooLittle' : null),
      // email: (val) => (/^\S+@\S+$/.test(val) ? null : 'fields.email.invalid'),
      // password: (val) => (val.length < 6 ? 'fields.password.tooLittle' : null),
    },
  })

  const signUp = async () => {
    const formValues = form.values
    const name = formValues.name
    const email = formValues.email
    const password = formValues.password

    const response = await fetch('http://localhost:3001/signUp', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    })

    if (!response.ok) {
      new window.Notification('Sign Up', { body: `Failed with: ${response.statusText}` })
      return
    }

    new window.Notification('Sign Up', { body: 'Successful' })
  }

  return (
    <div>
      <Container size={460} my={40}>
        <Title order={1} ta='center'>
          {'Sign up'}
        </Title>
        <Title order={2} ta='center' mb={'xl'}>
          {'Create your account'}
        </Title>

        <Flex direction={'column'}>
          <form onSubmit={form.onSubmit(signUp)}>
            <Stack>
              <TextInput
                withAsterisk
                label={'Username'}
                placeholder={'John Doe'}
                value={form.values.name}
                error={form.errors.name && form.errors.name.toString()}
                onChange={(e) => form.setFieldValue('name', e.currentTarget.value)}
                radius='md'
              />

              <TextInput
                withAsterisk
                label={'Email'}
                placeholder={'JohnDoe@gmail.com'}
                value={form.values.email}
                onChange={(e) => form.setFieldValue('email', e.currentTarget.value)}
                error={form.errors.email && form.errors.email.toString()}
                radius='md'
              />

              <PasswordInput
                withAsterisk
                label={'Password'}
                value={form.values.password}
                onChange={(e) => form.setFieldValue('password', e.currentTarget.value)}
                error={form.errors.password && form.errors.password.toString()}
                radius='md'
              />
              <PasswordInput
                withAsterisk
                label={'Confirm password'}
                value={form.values.confirmPassword}
                onChange={(e) => form.setFieldValue('confirmPassword', e.currentTarget.value)}
                error={form.errors.confirmPassword && form.errors.confirmPassword.toString()}
                radius='md'
              />
            </Stack>

            <Group justify='space-between' mt='xl'>
              <Anchor
                component='button'
                type='button'
                c='dimmed'
                onClick={() => {
                  //
                }}
                size='xs'
              >
                {'Already have an account? Login'}
              </Anchor>
              <Button type='submit' radius='xl'>
                {'Sign up'}
              </Button>
            </Group>
          </form>
        </Flex>
      </Container>
    </div>
  )
}
