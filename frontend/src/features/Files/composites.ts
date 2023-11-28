import axios, { AxiosResponse, AxiosProgressEvent } from 'axios'
import { Static } from '@feathersjs/typebox'
import { schema } from '@/shared/schemas/file'
import { AnyData, T18N } from '@/shared/interfaces/commons'
import { formatSize } from '@/shared/file'

const UPLOAD_URL = import.meta.env.VITE_API_URL

type StoreFile = Static<typeof schema>

export interface FileTypeInterface {
  name: string
  extensions: string[]
  mimeTypes: string[]
  icon: string
}

export type Base64 = string

export const supportedTypes: FileTypeInterface[] = [
  {
    name: 'png',
    extensions: ['png'],
    mimeTypes: ['image/png', 'image/x-png'],
    icon: 'mdi-file-png-box',
  },
  {
    name: 'jpeg',
    extensions: ['jpg'],
    mimeTypes: ['image/jpeg', 'image/tiff', 'image/gif'],
    icon: 'mdi-file-jpg-box',
  },
  {
    name: 'tiff',
    extensions: ['tiff'],
    mimeTypes: ['image/tiff'],
    icon: 'mdi-file-image',
  },
  {
    name: 'gif',
    extensions: ['gif'],
    mimeTypes: ['image/gif'],
    icon: 'mdi-file-gif-box',
  },
  {
    name: 'word',
    extensions: ['doc', 'docx'],
    mimeTypes: [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    icon: 'mdi-file-word',
  },
  {
    name: 'excel',
    extensions: ['xlsx', 'xls'],
    mimeTypes: [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
    icon: 'mdi-file-excel',
  },
  {
    name: 'powerpoint',
    extensions: ['pptx', 'ppt'],
    mimeTypes: ['application/vnd.ms-powerpoint'],
    icon: 'mdi-file-powerpoint',
  },
  {
    name: 'pdf',
    extensions: ['pdf'],
    mimeTypes: ['application/pdf'],
    icon: 'mdi-file-pdf-box',
  },
  {
    name: 'archive',
    extensions: ['zip'],
    mimeTypes: ['application/zip'],
    icon: 'mdi-zip-box',
  },
  {
    name: 'text',
    extensions: ['txt'],
    mimeTypes: ['text/plain'],
    icon: 'mdi-file-document',
  },
  {
    name: 'csv',
    extensions: ['csv'],
    mimeTypes: ['text/csv'],
    icon: 'mdi-file-table',
  },
  {
    name: 'html',
    extensions: ['html'],
    mimeTypes: ['text/html'],
    icon: 'mdi-file-code',
  },
  {
    name: 'mpeg',
    extensions: ['mpg'],
    mimeTypes: ['audio/mpeg'],
    icon: 'mdi-file-music',
  },
  {
    name: 'mp3',
    extensions: ['mp3'],
    mimeTypes: ['audio/mp3'],
    icon: 'mdi-file-music',
  },
  {
    name: 'wave',
    extensions: ['wav'],
    mimeTypes: ['audio/wav', 'audio/x-wav'],
    icon: 'mdi-file-music',
  },
  {
    name: 'mpeg',
    extensions: ['mpg'],
    mimeTypes: ['video/mpeg'],
    icon: 'mdi-file-video',
  },
  {
    name: 'mp4',
    extensions: ['mp4'],
    mimeTypes: ['video/mp4'],
    icon: 'mdi-file-video',
  },
  {
    name: 'wmv',
    extensions: ['wmv'],
    mimeTypes: ['video/x-ms-wmv'],
    icon: 'mdi-file-video',
  },
]

const fileStates = {
  ERROR: -1,
  NONE: 0,
  LOAD_START: 1,
  LOAD_PROGRESS: 2,
  LOAD_END: 3,
  UPLOAD_START: 10,
  UPLOAD_PROGRESS: 11,
  UPLOAD_END: 12,
  COMPLETED: 100,
}

const genericFileIcon = 'mdi-file'

const maxFileSize = 10485760

/**
 * Convert an ArrayBuffer into Base64
 *
 * @param buffer {ArrayBuffer} Input buffer
 *
 * @returns {string}
 */
const arrayBufferToBase64 = (buffer: ArrayBuffer): Base64 => {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}

export const useFiles = (t: T18N) => ({
  supportedTypes,

  genericFileIcon,

  maxFileSize,

  arrayBufferToBase64,

  fileStates,

  stateLabels: {
    LOAD_START: t('uploader.loadStart'),
    LOAD_PROGRESS: t('uploader.loadProgress'),
    LOAD_END: t('uploader.loadEnd'),
    UPLOAD_START: t('uploader.uploadStart'),
    UPLOAD_PROGRESS: t('uploader.uploadProgress'),
    UPLOAD_END: t('uploader.uploadEnd'),
    COMPLETED: t('uploader.completed'),
  },

  /**
   * An array of all mimeTypes
   */
  mimetypes: supportedTypes.reduce((acc, i) => (
    [...acc, ...i.mimeTypes]
  ), [] as string[]),

  formatSize,

  /**
   * Get the File type definition object for a specific mimeType
   *
   * @param mimeType Mime-type of the file
   *
   * @returns {FileTypeInterface} File type definition
   */
  fileTypeForMimeType: (mimeType: string): FileTypeInterface => (
    supportedTypes.find((i) => i.mimeTypes.includes(mimeType?.toLowerCase()))
  ),

  /**
   * Get the File type definition object for a specific extension
   *
   * @param extension Extension of the file
   *
   * @returns {FileTypeInterface} File type definition
   */
  fileTypeForExtension: (extension: string): FileTypeInterface => (
    supportedTypes.find((i) => i.extensions.includes(extension?.toLowerCase()))
  ),

  /**
   * Download a file in the browser
   *
   * @param filename
   * @param mimetype
   * @param data
   */
  download: (filename: string, mimetype: string, data: Base64 | Blob) => {
    let blob: Blob

    if (typeof data === 'string') {
      const binary = window.atob(data)
      const arr = Uint8Array.from([...binary].map((c) => c.charCodeAt(0)))
      blob = new Blob([arr], { type: decodeURIComponent(mimetype) })
    } else {
      blob = data as Blob
    }

    const url = window.URL.createObjectURL(blob)
    const fileDownloadLink = document.createElement('a')
    fileDownloadLink.setAttribute('href', url)
    fileDownloadLink.setAttribute(
      'download',
      decodeURIComponent(filename),
    )

    fileDownloadLink.click()
  },

  /**
   * Read a file from disk in the browser
   *
   * @param file The File which its progress will be updated
   * @param domFile The file from the input[type='file'] DOM element
   */
  readFile: (file: StoreFile, domFile: File): FileReader => {
    const reader = new FileReader()

    reader.onloadstart = function () {
      // eslint-disable-next-line no-param-reassign
      file.state = fileStates.LOAD_START
    }

    reader.onprogress = function (event) {
      const percentage = Math.round((100 * event.loaded) / event.total)
      // eslint-disable-next-line no-param-reassign
      file.state = fileStates.LOAD_PROGRESS
      // eslint-disable-next-line no-param-reassign
      file.progress = percentage
    }

    reader.onloadend = function (e) {
      const data = e.target.result as ArrayBuffer
      const { error } = e.target

      if (error !== null) {
        // eslint-disable-next-line no-param-reassign
        file.state = fileStates.ERROR

        switch (error.code) {
          case error.NOT_FOUND_ERR:
            // eslint-disable-next-line no-param-reassign
            file.error = t('uploader.notFound')
            break

          case error.NOT_SUPPORTED_ERR:
          case error.INVALID_ACCESS_ERR:
            // eslint-disable-next-line no-param-reassign
            file.error = t('uploader.notReadable')
            break

          case error.SECURITY_ERR:
            // eslint-disable-next-line no-param-reassign
            file.error = t('uploader.fileLocked')
            break

          case error.ABORT_ERR:
            // eslint-disable-next-line no-param-reassign
            file.error = t('uploader.readAborted')
            break

          default:
            // eslint-disable-next-line no-param-reassign
            file.error = t('uploader.somethingWrong')
        }
      } else {
        // we convert Buffer array to Base64
        // eslint-disable-next-line no-param-reassign
        file.data = arrayBufferToBase64(data)

        // eslint-disable-next-line no-param-reassign
        file.state = fileStates.LOAD_END
      }
    }

    reader.onabort = function () {
      //
    }

    reader.readAsArrayBuffer(domFile)

    return reader
  },

  /**
   * Upload a file in a streaming way to the backend (REST uploads service).
   *
   * NOTE: This service is disabled for now, we keep the code just in case we need it later on
   *
   * @param file File to upload
   * @param domFile File from the input[type='input'] DOM element
   * @param progressCallback Function to call on each chunk of data uploaded
   *
   * @returns {Promise<any>} Result from Axios REST call
   */
  uploadFile: async (
    file: StoreFile,
    domFile: File,
    progressCallback?: (event: AnyData) => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> => {
    const instance = axios.create({
      baseURL: UPLOAD_URL || 'http://localhost:3030/',
    })

    // eslint-disable-next-line no-param-reassign
    file.state = fileStates.UPLOAD_START

    const formData = new FormData()
    formData.append('file', domFile, domFile.name)

    const onUploadProgress = (event: AxiosProgressEvent) => {
      const percentage = Math.round((100 * event.loaded) / event.total)
      // eslint-disable-next-line no-param-reassign
      file.state = fileStates.UPLOAD_PROGRESS
      // eslint-disable-next-line no-param-reassign
      file.progress = percentage
      if (progressCallback) {
        progressCallback({ ...event, percentage })
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let res: AxiosResponse<any, any>

    try {
      const token = localStorage.getItem('feathers-jwt')

      res = await instance.post(
        '/uploads',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: token,
            tableId: file.tableId,
            docId: file.docId,
          },
          onUploadProgress,
        },
      )

      // eslint-disable-next-line no-param-reassign
      file.state = fileStates.UPLOAD_END
    } catch (e) {
      // eslint-disable-next-line no-param-reassign
      file.state = fileStates.ERROR
      // eslint-disable-next-line no-param-reassign
      file.error = e.message
      throw e
    }

    return res
  },
})
