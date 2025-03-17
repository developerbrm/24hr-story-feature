import { toast } from 'react-toastify'
import { StoryType } from '../Context/StoriesContextProvider'
import { getErrorMessage, isDateExpired } from '../utilities'

export const IMAGES_DB_KEY = 'images_DB'
const keyPath = 'fileName'

const getStore = (DB: IDBDatabase) =>
  DB.transaction('images', 'readwrite').objectStore('images')

const connectWithDB = async () => {
  const promise: Promise<IDBDatabase> = new Promise((resolve) => {
    const request = indexedDB.open(IMAGES_DB_KEY)
    request.onerror = (event: Event) => {
      const errorMessage = `Database error: ${(event.target as IDBOpenDBRequest)?.error?.message}`

      toast.error(errorMessage)
      console.error(errorMessage)
    }

    request.onsuccess = (event: Event) => {
      const DB = (event.target as IDBOpenDBRequest).result
      resolve(DB)
    }

    request.onupgradeneeded = (event: Event) => {
      const DB = (event.target as IDBOpenDBRequest).result

      if (!DB.objectStoreNames.contains('images')) {
        DB.createObjectStore('images', { keyPath })
      }

      resolve(DB)
    }
  })

  return promise
}

export const updateImagesDB = async (stories: StoryType[] = []) =>
  new Promise((resolve) => {
    connectWithDB().then((DB) => {
      stories.forEach((story) => {
        const store = getStore(DB)
        const request = store.put(story)

        request.onerror = (event: Event) => {
          const target = event.target as IDBRequest
          toast.error(getErrorMessage(target?.error as Error))
          console.error(target?.error)
        }

        request.onsuccess = (event: Event) => {
          const target = event.target as IDBRequest
          console.log(target.result)
        }
      })

      resolve('Updated')
    })
  })

export const getImagesFromDB = async (): Promise<StoryType[]> =>
  new Promise((resolve) => {
    connectWithDB().then((DB) => {
      const store = getStore(DB)
      const request = store.getAll()

      request.onerror = (event: Event) => {
        const target = event.target as IDBRequest

        toast.error(getErrorMessage(target?.error as Error))
        console.error(target?.error)

        resolve([])
      }

      request.onsuccess = (event: Event) => {
        const target = event.target as IDBRequest

        const data = filterExpiredStories(target.result)

        resolve(data)
      }
    })
  })

export const clearImagesFromDB = async () =>
  new Promise((resolve) => {
    connectWithDB().then((DB) => {
      const store = getStore(DB)
      const request = store.clear()

      request.onerror = (event: Event) => {
        const target = event.target as IDBRequest
        toast.error(getErrorMessage(target?.error as Error))
        console.error(target?.error)
      }

      request.onsuccess = () => {
        console.log('Images store cleared')

        resolve('Images store cleared')
      }
    })
  })

const deleteStory = async (story: StoryType, store: IDBObjectStore) => {
  const id = story[keyPath]
  const request = store.delete(id)

  request.onerror = (event: Event) => {
    const target = event.target as IDBRequest
    toast.error(getErrorMessage(target?.error as Error))
    console.error(target?.error)

    return Promise.reject(target.error as Error)
  }

  request.onsuccess = () => {
    console.log('Image deleted')

    return Promise.resolve('Image deleted')
  }
}

const handlePromises = async (
  allPromises: Promise<void>[],
  resolve: (value: unknown) => void
) => {
  Promise.allSettled(allPromises).then((results) => {
    const errors = results.filter((result) => result.status === 'rejected')
    if (errors.length > 0) {
      errors.forEach((err) => console.error(err.reason))
      resolve('Some images failed to delete')
    } else {
      resolve('All images deleted successfully')
    }
  })
}

export const deleteStoriesFromDB = async (stories: StoryType[]) =>
  new Promise((resolve) => {
    connectWithDB().then((DB) => {
      const store = getStore(DB)

      const allPromises = stories.map((story) => deleteStory(story, store))
      handlePromises(allPromises, resolve)
    })
  })

export const filterExpiredStories = async (
  stories: StoryType[]
): Promise<StoryType[]> =>
  new Promise((resolve) => {
    const expiredStories: StoryType[] = []
    const validStories: StoryType[] = []

    stories.forEach((story) => {
      if (isDateExpired(story.storyExpirationDate)) {
        expiredStories.push(story)
      } else {
        validStories.push(story)
      }
    })

    deleteStoriesFromDB(expiredStories).then(() => {
      resolve(validStories)
    })
  })
