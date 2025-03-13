import { useMemo, useState } from 'react'
import { StoriesContext } from './StoriesContext'

export type StoriesType = { file: File; data: string }[] | null
export type CurrentSelectedStoryType = string | null

export interface StoriesContextInterface {
  stories: StoriesType
  setStories: React.Dispatch<React.SetStateAction<StoriesType>>
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
  const [stories, setStories] = useState<StoriesType>(null)
  const [currentSelectedStory, setCurrentSelectedStory] =
    useState<CurrentSelectedStoryType>(null)

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
