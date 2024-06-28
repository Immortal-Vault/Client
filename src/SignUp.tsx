﻿import {
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
import validator from 'validator'
import passwordValidator from 'password-validator'
import { useNavigate } from 'react-router-dom'
import { ROUTER_PATH } from './shared/constants'

export default function SignUp() {
  const navigate = useNavigate()
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      confirmPassword: '',
    },

    validate: {
      name: (val) => (val.length < 4 ? 'The name cannot be less than 4 characters' : null),
      email: (val) => (validator.isEmail(val) ? null : 'Email is not valid'),
      password: (val) => {
        const schema = new passwordValidator()
        schema
          .is()
          .min(8) // Minimum length 8
          .is()
          .max(100) // Maximum length 100
          .has()
          .uppercase() // Must have uppercase letters
          .has()
          .lowercase() // Must have lowercase letters
          .has()
          .digits(2) // Must have at least 2 digits
          .has()
          .not()
          .spaces() // Should not have spaces

        return !schema.validate(val)
          ? 'Password must be no less than 8 and no more than 100 characters, must have at least one small and capital letter, at least 2 characters and no spaces'
          : null
      },
    },
  })

  const signUp = async () => {
    const formValues = form.values
    const name = formValues.name
    const email = formValues.email
    const password = formValues.password
    const confirmPassword = formValues.confirmPassword

    if (password !== confirmPassword) {
      new window.Notification('Sign Up', { body: 'Passwords do not match' })
      return
    }

    let response

    try {
      response = await fetch(`${process.env.API_SERVER_URL}/signUp`, {
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
    } catch (error) {
      new window.Notification('Sign Up', {
        body: 'Immortal Vault server is down, please try again later',
      })
      return
    }

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
                error={form.errors.password && form.errors.password.toString()}
                radius='md'
              />
            </Stack>

            <Group justify='space-between' mt='xl'>
              <Anchor
                component='button'
                type='button'
                c='dimmed'
                size='xs'
                onClick={() => navigate(ROUTER_PATH.SIGN_IN)}
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