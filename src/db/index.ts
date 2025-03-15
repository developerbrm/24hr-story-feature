import { toast } from 'react-toastify'
import { StoryType } from '../Context/StoriesContextProvider'
import { getErrorMessage } from '../utilities'

export const IMAGES_DB_KEY = 'images_DB'
const keyPath = 'fileName'

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
      resolve(DB)

      if (!DB.objectStoreNames.contains('images')) {
        DB.createObjectStore('images', { keyPath })
      }
    }
  })

  return promise
}

export const updateImagesDB = async (stories: StoryType[] = []) =>
  new Promise((resolve) => {
    connectWithDB().then((DB) => {
      stories.forEach((story) => {
        const transaction = DB.transaction('images', 'readwrite')
        const store = transaction.objectStore('images')
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
      const transaction = DB.transaction('images', 'readonly')
      const store = transaction.objectStore('images')
      const request = store.getAll()

      request.onerror = (event: Event) => {
        const target = event.target as IDBRequest

        toast.error(getErrorMessage(target?.error as Error))
        console.error(target?.error)

        resolve([])
      }

      request.onsuccess = (event: Event) => {
        const target = event.target as IDBRequest

        const data = target.result

        resolve(data)
      }
    })
  })

export const clearImagesFromDB = async () =>
  new Promise((resolve) => {
    connectWithDB().then((DB) => {
      const transaction = DB.transaction('images', 'readwrite')
      const store = transaction.objectStore('images')
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
