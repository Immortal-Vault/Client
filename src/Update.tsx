import { channels } from './shared/constants'
import { useEffect, useState } from 'react'
import { Button, Dialog, Group, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

const { ipcRenderer } = window.require('electron')

export default function Update() {
  const [opened, { toggle, close }] = useDisclosure(false)
  const [newVersion, setNewVersion] = useState('')
  const [downloadUrl, setDownloadUrl] = useState('')

  useEffect(() => {
    ipcRenderer.on(channels.NEW_UPDATE, (event, args) => {
      if (!args.available) {
        return
      }

      setNewVersion(args.version)
      setDownloadUrl(args.downloadUrl)
      toggle()
    })

    ipcRenderer.send(channels.NEW_UPDATE)

    return () => {
      ipcRenderer.removeAllListeners(channels.NEW_UPDATE)
    }
  }, [])

  const triggerUpdate = () => {
    ipcRenderer.send(channels.TRIGGER_UPDATE, downloadUrl)
    close()
  }

  return (
    <>
      <Dialog opened={opened} withCloseButton onClose={close} size='lg' radius='md'>
        <Text size='sm' mb='xs' fw={500}>
          Update available
        </Text>

        <Group align='flex-end'>
          <Text size='sm' mb='xs' fw={500}>
            Do you want update Immortal Vault to version {newVersion}?
          </Text>
          <Button onClick={triggerUpdate}>Yes</Button>
          <Button onClick={close}>No</Button>
        </Group>
      </Dialog>
    </>
  )
}
