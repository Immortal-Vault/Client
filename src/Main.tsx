import { Title } from '@mantine/core'
import { useContext, useEffect } from 'react'
import { AuthContext } from './stores/Auth/AuthContext'
import { useNavigate } from 'react-router-dom'
import { ROUTER_PATH } from './shared/constants'

export default function Main() {
  const navigate = useNavigate()
  const { authState } = useContext(AuthContext)

  useEffect(() => {
    if (!authState) {
      navigate(ROUTER_PATH.SIGN_IN)
    }
  }, [authState])

  return (
    <div>
      <Title order={2}>Main View</Title>
    </div>
  )
}
