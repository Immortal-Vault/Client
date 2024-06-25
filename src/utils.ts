import { execFile } from 'child_process'
import { promisify } from 'util'
import log from 'electron-log/main'
import { Downloader } from 'nodejs-file-downloader'

const execFileAsync = promisify(execFile)

export async function downloadFile(url: string, outputDirectory: string, fileName: string) {
  log.info(`Attempt to download file with url: ${url}, outputDirectory: ${outputDirectory}`)
  const downloader = new Downloader({
    url,
    directory: outputDirectory,
    fileName,
    onBeforeSave: (deducedName) => {
      log.info(`The downloaded file name will be: ${deducedName}`)
    },
  })

  try {
    const { filePath, downloadStatus } = await downloader.download()

    log.info(`Download file info with url: ${url}, path: ${filePath}, status: ${downloadStatus}`)
  } catch (error) {
    log.error('Download file failed: ', error)
  }
}

export async function runExe(exePath: string) {
  try {
    log.info(`Try to run ${exePath}`)
    await execFileAsync(exePath)
  } catch (error) {
    log.error(`Error executing ${exePath}: ${error.message}`)
  }
}
