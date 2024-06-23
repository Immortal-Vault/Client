import { Anchor, Button, Container, Flex, Group, PasswordInput, Stack, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'

export default function Main() {
  const form = useForm({
    initialValues: {
      email: '',
      username: '',
      password: '',
    },

    validate: {
      // username: (val) => (val.length < 4 ? 'fields.username.tooLittle' : null),
      // email: (val) => (/^\S+@\S+$/.test(val) ? null : 'fields.email.invalid'),
      // password: (val) => (val.length < 6 ? 'fields.password.tooLittle' : null),
    },
  })

  const signUp = async () => {
    //
  }

  return (
    <div>
      <Container size={460} my={40}>
        <Title order={1} ta='center'>
          {'Sign up'}
        </Title>
        <Title order={2} ta="center" mb={'xl'}>
          {'Create your account'}
        </Title>

        <Flex direction={'column'}>
          <form onSubmit={form.onSubmit(signUp)}>
            <Stack>
              <TextInput
                withAsterisk
                label={'Username'}
                placeholder={'John Doe'}
                value={form.values.username}
                error={form.errors.username && form.errors.username.toString()}
                onChange={(event) => form.setFieldValue('username', event.currentTarget.value)}
                radius='md'
              />

              <TextInput
                withAsterisk
                label={'Email'}
                placeholder={'JohnDoe@gmail.com'}
                value={form.values.email}
                onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                error={form.errors.email && form.errors.email.toString()}
                radius='md'
              />

              <PasswordInput
                withAsterisk
                label={'Password'}
                value={form.values.password}
                onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                error={form.errors.password && form.errors.password.toString()}
                radius='md'
              />
              <PasswordInput
                withAsterisk
                label={'Confirm password'}
                value={form.values.password}
                onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                error={form.errors.password && form.errors.password.toString()}
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
