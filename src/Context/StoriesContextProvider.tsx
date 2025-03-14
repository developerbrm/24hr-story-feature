import { useLayoutEffect, useMemo, useState } from 'react'
import { getImagesFromDB } from '../utilities'
import { StoriesContext } from './StoriesContext'
import ImagePreviewModal from '../assets/components/ImagePreviewModal'

export type StoryType = { fileName: string; data: string; isWatched: boolean }
export type StoriesTypeArr = StoryType[] | null

export interface StoriesContextInterface {
  stories: StoriesTypeArr
  setStories: React.Dispatch<React.SetStateAction<StoriesTypeArr>>
  currentSelectedStory: number
  setCurrentSelectedStory: React.Dispatch<React.SetStateAction<number>>
}

const StoriesContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [stories, setStories] = useState<StoriesTypeArr>(null)
  const [currentSelectedStory, setCurrentSelectedStory] = useState<number>(0)

  useLayoutEffect(() => {
    const data = getImagesFromDB()
    if (!data?.length) return

    setStories(() => data)
  }, [])

  const contextValue = useMemo(
    () => ({
      stories,
      setStories,
      currentSelectedStory,
      setCurrentSelectedStory,
    }),
    [stories, setStories, currentSelectedStory, setCurrentSelectedStory]
  )

  return (
    <StoriesContext.Provider value={contextValue}>
      {children}
      <ImagePreviewModal />
    </StoriesContext.Provider>
  )
}

export default StoriesContextProvider
