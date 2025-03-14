import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'
import ImagePreviewModal from '../assets/components/ImagePreviewModal'
import { Delay, getImagesFromDB, handleImagePreviewDialog } from '../utilities'
import { StoriesContext } from './StoriesContext'

export type StoryType = { fileName: string; data: string; isWatched: boolean }
export type StoriesTypeArr = StoryType[] | null

const d = new Delay()

export interface StoriesContextInterface {
  stories: StoriesTypeArr
  setStories: React.Dispatch<React.SetStateAction<StoriesTypeArr>>
  currentSelectedStory: number
  setCurrentSelectedStory: React.Dispatch<React.SetStateAction<number>>
  setMountImagesPreviewModal: React.Dispatch<React.SetStateAction<boolean>>
  handleImagePreviewModalOpenClose: (open: boolean) => void
}

const StoriesContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [stories, setStories] = useState<StoriesTypeArr>(null)
  const [currentSelectedStory, setCurrentSelectedStory] = useState<number>(0)
  const [mountImagesPreviewModal, setMountImagesPreviewModal] = useState(false)

  useLayoutEffect(() => {
    const data = getImagesFromDB()
    if (!data?.length) return

    setStories(() => data)
  }, [])

  useEffect(() => {
    d.delay(0, () => {
      handleImagePreviewDialog(mountImagesPreviewModal)
    })
  }, [mountImagesPreviewModal])

  const handleImagePreviewModalOpenClose = useCallback(
    (open: boolean = true) => {
      setMountImagesPreviewModal(open)
    },
    [setMountImagesPreviewModal]
  )

  const contextValue = useMemo(
    () => ({
      stories,
      setStories,
      currentSelectedStory,
      setCurrentSelectedStory,
      setMountImagesPreviewModal,
      handleImagePreviewModalOpenClose,
    }),
    [
      stories,
      setStories,
      currentSelectedStory,
      setCurrentSelectedStory,
      setMountImagesPreviewModal,
      handleImagePreviewModalOpenClose,
    ]
  )

  return (
    <StoriesContext.Provider value={contextValue}>
      {children}

      {mountImagesPreviewModal && <ImagePreviewModal />}
    </StoriesContext.Provider>
  )
}

export default StoriesContextProvider
