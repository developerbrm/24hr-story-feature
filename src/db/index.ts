import { toast } from 'react-toastify'
import { StoryType } from '../Context/StoriesContextProvider'
import { getErrorMessage } from '../utilities'

export const IMAGES_DB_KEY = 'images'

export const updateImagesDB = (stories: StoryType[] = []) => {
  const stringifiedData = JSON.stringify(stories ?? [])

  try {
    localStorage.setItem(IMAGES_DB_KEY, stringifiedData)
  } catch (err) {
    console.error(err)
    toast.error(getErrorMessage(err as Error))
  }
}

export const getImagesFromDB = (): StoryType[] => {
  const stringifiedData = localStorage.getItem(IMAGES_DB_KEY)

  if (stringifiedData) {
    const data = JSON.parse(stringifiedData)
    return data
  }

  return []
}
