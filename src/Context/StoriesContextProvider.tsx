import { useLayoutEffect, useMemo, useState } from 'react'
import { getImagesFromDB } from '../utilities'
import { StoriesContext } from './StoriesContext'

export type StoryType = { fileName: string; data: string; isWatched: boolean }
export type StoriesTypeArr = StoryType[] | null
export type CurrentSelectedStoryType = string | null

export interface StoriesContextInterface {
  stories: StoriesTypeArr
  setStories: React.Dispatch<React.SetStateAction<StoriesTypeArr>>
  currentSelectedStory: CurrentSelectedStoryType
  setCurrentSelectedStory: React.Dispatch<
    React.SetStateAction<CurrentSelectedStoryType>
  >
}

const StoriesContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [stories, setStories] = useState<StoriesTypeArr>(null)
  const [currentSelectedStory, setCurrentSelectedStory] =
    useState<CurrentSelectedStoryType>(null)

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
    </StoriesContext.Provider>
  )
}

export default StoriesContextProvider
