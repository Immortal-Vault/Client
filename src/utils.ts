import { execFile } from 'child_process'
import { promisify } from 'util'
import log from 'electron-log/main'
import { Downloader } from 'nodejs-file-downloader'
import { ipcMain } from 'electron'
import { channels } from './shared/constants'

const execFileAsync = promisify(execFile)
let updateProgress = ''

export async function downloadFile(
  url: string,
  outputDirectory: string,
  fileName: string,
): Promise<boolean> {
  log.info(`Attempt to download file with url: ${url}, outputDirectory: ${outputDirectory}`)
  const downloader = new Downloader({
    url,
    directory: outputDirectory,
    fileName,
    cloneFiles: false,
    onBeforeSave: (deducedName) => {
      log.info(`The downloaded file name will be: ${deducedName}`)
    },
    onProgress(percentage: string, chunk: object, remainingSize: number) {
      updateProgress = percentage
    },
  })

  try {
    ipcMain.on(channels.UPDATE_PROGRESS, getUpdateProgress)
    const { filePath, downloadStatus } = await downloader.download()

    log.info(`Download file info with url: ${url}, path: ${filePath}, status: ${downloadStatus}`)
    ipcMain.removeListener(channels.TRIGGER_UPDATE, getUpdateProgress)
    return downloadStatus === 'COMPLETE'
  } catch (error) {
    log.error('Download file failed: ', error)
    ipcMain.removeListener(channels.TRIGGER_UPDATE, getUpdateProgress)
  }

  return false
}

async function getUpdateProgress(event: Electron.IpcMainEvent, args: any) {
  event.sender.send(channels.UPDATE_PROGRESS, {
    progress: updateProgress,
  })
}

export async function runExe(exePath: string) {
  try {
    log.info(`Try to run ${exePath}`)
    await execFileAsync(exePath)
  } catch (error) {
    log.error(`Error executing ${exePath}: ${error.message}`)
  }
}
