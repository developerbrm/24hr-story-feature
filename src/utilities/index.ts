import { StoryType } from '../Context/StoriesContextProvider'

export const PROGRESS_DELAY = 3000
export const commonStoriesClasses = `grid aspect-square w-16 cursor-pointer place-content-center rounded-full shadow-[2px_2px_5px_1px_rgba(0,0,0,0.25)]`

export const handleFileItem = async (file: File) =>
  new Promise((resolve: (obj: StoryType) => unknown, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)

    if (reader.error) {
      reject(reader.error)
      return
    }

    reader.onload = (e) =>
      resolve({
        fileName: file.name,
        data: e.target?.result as string,
        isWatched: false,
      })

    if (reader.error) throw reader.error
  })

export const getErrorMessage = (err: {
  message?: string
  data?: { message: string }
  response?: { data?: { message: string } }
  error?: { message: string }
}) => {
  return (
    err?.response?.data?.message ??
    err?.message ??
    err.data?.message ??
    'Something went wrong'
  )
}

export const handleImagePreviewDialog = (open: boolean = true) => {
  const element: null | HTMLDialogElement = document.querySelector(
    '#image-preview-modal'
  )
  const method = open ? 'showModal' : 'close'
  element?.[method]()
}

export class Delay {
  timeOutId: number | null = null

  delay(ms: number = 1000, cb: () => void = () => {}) {
    if (this.timeOutId) clearTimeout(this.timeOutId)

    this.timeOutId = setTimeout(() => {
      cb()
      this.timeOutId = null
    }, ms)
  }
}
