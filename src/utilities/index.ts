import { toast } from 'react-toastify'

export const IMAGES_DB_KEY = 'images'

export const handleFileItem = async (file: File) =>
  new Promise(
    (resolve: (obj: { file: File; data: string }) => unknown, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)

      if (reader.error) {
        reject(reader.error)
        return
      }

      reader.onload = (e) => resolve({ file, data: e.target?.result as string })

      if (reader.error) throw reader.error
    }
  )

export const updateImagesDB = (map: Map<string, string>) => {
  const stringifiedMap = JSON.stringify(Array.from(map.entries()))

  try {
    localStorage.setItem(IMAGES_DB_KEY, stringifiedMap)
  } catch (err) {
    console.error(err)
    toast.error(getErrorMessage(err))
  }
}

export const getImagesFromDB = () => {
  const stringifiedMap = localStorage.getItem(IMAGES_DB_KEY)

  if (stringifiedMap) {
    const map = new Map(JSON.parse(stringifiedMap))
    return map
  }
}

export const getErrorMessage = (err: {
  message?: string
  data?: { message: string }
  response?: { data?: { message: string } }
}) => {
  return (
    err?.response?.data?.message ??
    err?.message ??
    err.data?.message ??
    'Something went wrong'
  )
}
