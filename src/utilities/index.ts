import dayjs from 'dayjs'
import { StoriesTypeArr, StoryType } from '../Context/StoriesContextProvider'
import { deleteStory } from '../db'

export const PROGRESS_DELAY = 3000
export const commonStoriesClasses = `grid aspect-square w-16 cursor-pointer place-content-center rounded-full shadow-[2px_2px_5px_1px_rgba(0,0,0,0.25)]`

export const expiryControlObj: { value: number; unit: dayjs.ManipulateType } = {
  value: 1,
  unit: 'minutes',
}

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
        createdAt: dayjs().toString(),
        storyExpirationDate: dayjs()
          .add(expiryControlObj.value, expiryControlObj.unit)
          .toString(),
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

export const isDateExpired = (dateString: string) =>
  dayjs().isAfter(dayjs(dateString))

export const handleOnExpiration = (
  stories: StoryType[],
  setStories: React.Dispatch<React.SetStateAction<StoriesTypeArr>>
) => {
  if (!stories?.length) return

  const handleDelay = (story: StoryType) => {
    setStories((prevStories) => {
      const finalStories = prevStories?.filter((s) => {
        if (s.fileName === story.fileName) {
          deleteStory(s)

          return false
        }

        return true
      })

      return finalStories ?? []
    })
  }

  stories.forEach((story) => {
    const d = new Delay()

    const timerDuration = Math.max(
      0,
      dayjs(story.storyExpirationDate).diff(dayjs())
    )

    d.delay(timerDuration, () => handleDelay(story))
  })
}
